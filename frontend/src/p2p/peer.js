class CustomPeer {
    constructor() {
        this.isHost = true;
        this.connections = [];
        this.peer = new Peer();
        this.idPromise = new Promise((resolve) => {
            this.peer.on('open', (id) => {
                resolve(id);
            });
        });
        this.peer.on('connection', (conn) => this.onConnection(conn));
    }

    async getId() {
        try {
            return await this.idPromise;
        } catch (error) {
            console.error("Erro ao obter o ID:", error);
            throw error;
        }
    }

    connectToPeer(id) {
        this.isHost = false;
        const conn = this.peer.connect(id);

        conn.on('open', () => {
            this.onConnection(conn);

            const message = new Message('connList', this.connections);
            conn.send(message);
        })

        conn.on('close', () => {
            this.connections = this.connections.filter((e) => e.peer !== conn.peer);

            conn.close();
            console.log(`Conexão com ${conn.peer} fechada!`);
        });
    }

    onConnection(conn) {
        conn.on('data', (data) => this.onData(data));

        this.connections.push(conn.peer);

        if (this.isHost) {
            const message = new Message('connList', this.connections);
            this.brodcast(message);
        }

        conn.send(`Hi ${conn.peer}, ${conn.provider._id} here!`);
    }

    onData(data) {
        if (data.type === 'connList') {
            this.onReceiveConnections(data.message);
        } else if (data.type === 'gameTick') {
            onReceiveGameTick(data.message);
        } else {
            console.log(data);
        }
    }

    onReceiveConnections(connections) {
        const newConnections = connections.filter((conn) => !this.connections.includes(conn) && conn !== this.peer._id);
        newConnections.forEach((conn) => {
            console.log("Tentando conexão com ", conn);
            this.connectToPeer(conn);
        })
        onPlayerJoin(connections);
    }

    brodcast(data) {
        this.peer._connections.forEach((conn) => {
            conn.forEach((c) => {
                c.send(data);
            });
        });
    }

    onReceiveGameTick(tick) {

    }
}