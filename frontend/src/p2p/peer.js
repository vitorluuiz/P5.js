class CustomPeer {
    constructor() {
        this.isHost = true;
        this.peer = new Peer();
        this.idPromise = new Promise((resolve) => {
            this.peer.on('open', (id) => {
                resolve(id);
            });
        });
        this.peer.on('connection', (conn) => this.onConnection(conn));
    }

    // this peer is called to join to network
    connectToPeer(idPeer) {
        // if this peer is connecting to another peer, it's not the host
        this.isHost = false;
        const conn = this.peer.connect(idPeer);

        this.onConnection(conn);

        conn.on('close', () => {
            conn.close();
        });
    }

    // This function is called when this peer connect to another peer
    onConnection(conn) {
        conn.on('open', () => {
            conn.on('data', (data) => this.onData(data));
            conn.send(`Hi ${conn.peer}, ${conn.provider._id} here!`);

            if (this.isHost) {
                const connections = Array.from(this.peer._connections.keys());
                const connList = new Message('connList', connections);

                conn.send(connList); //an error occurs here see the console
            }
        });
    }

    // send a message for all peer connected
    brodcast(data) {
        this.peer._connections.forEach((conn) => {
            conn[0].send(data);
        });
    }

    // This function is called when this peer receives a new message
    onData(data) {
        switch (data.type) {
            case 'connList':
                this.onReceiveConnections(data.message);
                break;
            case 'gameTick':
                this.onReceiveGameTick(data.message);
                break;
            default:
                console.log(data);
                break;
        }
    }

    // This function is called when this peer receives the current peers on network
    onReceiveConnections(connections) {
        // handle connections received from the host
        const utilsConnections = connections.filter((conn) => conn !== this.peer._id);

        // Connecting to all the other peers
        utilsConnections.forEach((conn) => {
            this.connectToPeer(conn);
        })
    }
}