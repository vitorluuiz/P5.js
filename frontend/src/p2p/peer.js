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
        }

        const conn = this.myPeer.connect(idPeer);

        this.onConnection(conn);

        conn.on('close', () => {
            this.isHost = true;
            this.myHost = '';
            console.log('Connection closed');

            conn.close();
        });
    }

    // This function is called when this peer connect to another peer
    onConnection(conn) {
        conn.on('open', () => {
            conn.on('data', (data) => this.onData(data));
            conn.send(`Hi ${conn.peer}, ${conn.provider._id} here!`);
            // onPlayerJoin(conn.peer);

            if (this.isHost) {
                const connections = this.getMyConnections();
                const connList = new Message('connList', connections);

                conn.send(connList);
            }
        });
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

    onReceiveGameMessage(message) {
    }
}