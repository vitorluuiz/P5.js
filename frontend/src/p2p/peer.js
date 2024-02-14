const PING_TIMEOUT = 5000; // 5000ms to host consider a peer disconnected
const PING_INTERVAL = 3000; // 3000ms to send a ping to the host

class CustomPeer {
    constructor() {
        this.isHost = true;
        this.myHost = '';
        this.myPeer = new Peer();
        this.idPromise = new Promise((resolve) => {
            this.myPeer.on('open', (id) => {
                resolve(id);
            });
        });
        this.myPeer.on('connection', (conn) => this.onConnection(conn));
        this.pingList = [];
    }

    getMyConnections = () => Array.from(this.myPeer._connections.keys())

    // this peer is called to join to network
    connectToPeer(idPeer) {
        // In the first time, this peer is connecting to the host
        if (this.isHost) {
            // assign the host id
            this.myHost = idPeer;
            // if this peer is connecting to another peer, it's not the host
            this.isHost = false;

            // Time out to send a ping to the host
            setInterval(() => this.sendPing(), PING_INTERVAL)
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

        conn.on('close', () => {
            log('Connection closed');
        });
    }

    // This function is called when a peer is disconnected
    onDisconnection(idPeer) {
        // Delete the peer from my connections
        this.myPeer._connections.delete(idPeer);

        // Treat if the disconnected peer is alive in the game
        // ...
        // Mock the game message
        const gameMessage = new GameMessage('playerLeft', idPeer);

        // Call the game message logic
        onReceiveGameMessage(gameMessage);

        if (this.isHost) {
            // Delete the peer from the ping list
            this.pingList[idPeer].conn.close();
            delete this.pingList[idPeer];

            // Remove the peer from the room in the rooms server
            fetch(`http://localhost:5000/room/${this.myPeer._id}/playerLeft`, {
                headers: { 'Content-Type': 'application/json' },
                method: 'PATCH',
                body: JSON.stringify({ playerName: idPeer, playerId: idPeer })
            });

            const message = new Message('disconnection', idPeer);
            this.brodcast(message);
        }

        console.log(`${idPeer} is disconnected`);
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

    // Send a ping to the host
    sendPing() {
        console.log(`Sending ping to: ${this.myHost}`);
        this.myPeer.connections[this.myHost][0].send(new Message('ping', this.myPeer._id));
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