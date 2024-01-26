class CustomPeer {
    constructor() {
        this.id = null;
        this.peer = new Peer();
        this.peer.on('open', (id) => {
            console.log('ID do Peer:', id);
            this.id = id;
        });
    }

    connectToPeer(id) {
        const conn = this.peer.connect(id);

        conn.on('open', this.onConnection())

        conn.on('data', (data) => onData(data));

        conn.on('close', () => {
            conn.close();
            console.log('Conexão fechada!');
        });
    }

    onConnection() {
        this.peer.on('connection', (conn) => {
            console.log('Nova conexão recebida!');
        });
    }

    onData(data){
        console.log('Data received:', data);
    }
}