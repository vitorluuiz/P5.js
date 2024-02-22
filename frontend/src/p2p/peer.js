const PING_TIMEOUT = 6000; // to host consider a peer disconnected
const PING_INTERVAL = 5000; // to send a ping to the host

class CustomPeer {
    constructor() {
        this.isHost = true;
        this.isSubHost = false;
        this.firstConn = () => this.getMyConnections()[0];
        this.myPingInterval = null;
        this.pingList = [];

        this.myPeer = new Peer();
        this.idPromise = new Promise((resolve) => {
            this.myPeer.on('open', (id) => {
                resolve(id);
            });
        });
        this.myPeer.on('connection', (conn) => this.onConnection(conn));
    }

    getMyConnections = () => Array.from(this.myPeer._connections.keys())

    // this peer is called to join to network
    connectToPeer(idPeer) {
        // In the first time, this peer is connecting to the host
        if (this.isHost) {
            // if this peer is connecting to another peer, it's not the host
            this.isHost = false;

            // Time out to send a ping to the host
            this.myPingInterval = setInterval(() => this.sendPing(), PING_INTERVAL)
        }

        const conn = this.myPeer.connect(idPeer);

        this.onConnection(conn);
    }

    // This function is called when this peer connect to another peer
    onConnection(conn) {
        conn.on('open', () => {
            // Adding a data listener to the connection
            conn.on('data', (data) => this.onData(data));

            // Send a message to the new peer
            conn.send(`Hi ${conn.peer}, ${conn.provider._id} here!`);

            // If Host treat the host logic
            if (this.isHost) {
                // If the host is connecting to the first peer, the first peer is the predecessor
                if (this.getMyConnections().length === 1) {
                    // conn is the sub host
                    const message = new Message('subHost', this.myPeer._id);
                    conn.send(message);

                    // Timeout to send a ping to the host
                    this.myPingInterval = setInterval(() => this.sendPing(), PING_INTERVAL)
                }

                // Add the new peer to the ping list
                this.pingList[conn.peer] = {
                    conn: conn,
                    timeout: this.startPingTimeout(conn.peer)
                }

                // Push the new peer to the room
                fetch(`http://localhost:5000/room/${this.myPeer._id}/playerJoin`, {
                    headers: { 'Content-Type': 'application/json' },
                    method: 'PATCH',
                    body: JSON.stringify({ playerName: conn.provider._id, playerId: conn.provider._id })
                });

                // Send the new peer to all the other peers currently connected
                const connections = this.getMyConnections();
                const connList = new Message('connList', connections);

                conn.send(connList);
            }
        });
    }

    // This function is called when a peer is disconnected
    onDisconnection(idPeer) {
        // If the disconnected peer is not the host
        if (this.isHost) {
            const disconnectionMessage = new Message('disconnection', idPeer);
            this.brodcast(disconnectionMessage);

            // Delete the peer from the ping list
            delete this.pingList[idPeer];

            // Remove the peer from the room in the rooms server
            fetch(`http://localhost:5000/room/${this.myPeer._id}/playerLeft`, {
                headers: { 'Content-Type': 'application/json' },
                method: 'PATCH',
                body: JSON.stringify({ playerName: idPeer, playerId: idPeer })
            });

            if (idPeer === this.firstConn()) {
                const newSubHost = new Message('subHost', this.myPeer._id);
                this.myPeer.connections[this.myHeir()][0].send(newSubHost);
            }
        }

        // If the disconnected peer is the host
        if (idPeer === this.firstConn()) {
            // Stop the ping interval to host and restart it
            clearInterval(this.myPingInterval);

            // Delete the peer from my connections
            this.myPeer._connections.delete(idPeer);

            // If im the sub host
            if (this.isSubHost) {
                const disconnectionMessage = new Message('disconnection', idPeer);
                this.brodcast(disconnectionMessage);

                // Delete the peer from the ping list
                delete this.pingList[idPeer];

                // Im not the sub host anymore
                this.isSubHost = false;

                // Im the new host
                this.isHost = true;

                if (this.firstConn() !== undefined) {
                    // Send to the new sub host the subHost message
                    const message = new Message('subHost', this.myPeer._id);
                    this.myPeer.connections[this.firstConn()][0].send(message);

                    // Add the new sub host to the ping list
                    this.pingList[this.firstConn()] = {
                        conn: this.myPeer.connections[this.firstConn()][0],
                        timeout: this.startPingTimeout(this.firstConn())
                    }
                }

                // Remove the peer from the room in the rooms server
                fetch(`http://localhost:5000/room/${idPeer}/playerLeft`, {
                    headers: { 'Content-Type': 'application/json' },
                    method: 'PATCH',
                    body: JSON.stringify({ playerName: idPeer, playerId: idPeer })
                });

                // Send to server that the host is disconnected
                fetch(`http://localhost:5000/room/${idPeer}`, {
                    headers: { 'Content-Type': 'application/json' },
                    method: 'PATCH',
                    body: JSON.stringify({ ownerName: this.myPeer._id, idPlayer: this.myPeer._id })
                });
            }

            if (this.firstConn() !== undefined) {
                this.myPingInterval = setInterval(() => this.sendPing(), PING_INTERVAL);
            }
        }

        // Mock the game message
        const gameMessage = new GameMessage('playerLeft', idPeer);

        // Call the game message logic
        onReceiveGameMessage(gameMessage);
    }

    // send a message for all peer connected
    brodcast(data) {
        this.myPeer._connections.forEach((conn) => {
            conn.forEach((c) => c.send(data));
        });
    }

    // This function is called when this peer receives a new message
    onData(data) {
        switch (data.type) {
            case 'connList':
                this.onReceiveConnections(data.data);
                break;
            case 'gameMessage':
                onReceiveGameMessage(data.data);
                break;
            case 'ping':
                this.handlePing(data.data);
                break;
            case 'disconnection':
                this.onDisconnection(data.data);
                break;
            case 'subHost':
                this.onSubHost(data.data);
                break;
            default:
                console.log(data);
                break;
        }
    }

    // This function is called when this peer receives the current peers on network
    onReceiveConnections(connections) {
        // handle connections received from the host
        const utilsConnections = connections.filter((conn) => conn !== this.myPeer._id);

        // Connecting to all the other peers
        utilsConnections.forEach((conn) => {
            this.connectToPeer(conn);
        })
    }

    onSubHost(idHost) {
        this.isSubHost = true;
        console.log(`I'm the sub host of ${idHost}`);

        // Add the host to the ping list
        this.pingList[idHost] = {
            conn: this.myPeer.connections[idHost][0],
            timeout: this.startPingTimeout(idHost)
        }
    }

    // Send a ping to the host
    sendPing() {
        console.log(`Sending ping to: ${this.firstConn()}`);

        if (this.myPeer.connections[this.firstConn()][0] !== undefined) {
            this.myPeer.connections[this.firstConn()][0].send(new Message('ping', this.myPeer._id));
        }
    }

    // Handle the timeout to consider a peer disconnected
    startPingTimeout = (idPeer) => {
        return setTimeout(() => {
            this.onDisconnection(idPeer);
        }, PING_TIMEOUT);
    }

    // When a ping is received, this function is called
    handlePing(idPeer) {
        console.log(`${idPeer} ping's received!`);

        // Clean the previous timeout
        clearTimeout(this.pingList[idPeer].timeout);

        // Start a new timeout
        this.pingList[idPeer].timeout = this.startPingTimeout(idPeer);
    };
}