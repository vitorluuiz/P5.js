const sendPointerPosition = (x, y) => {
    const pointer = new PointerPosition(peer.myPeer._id, x, y);
    const message = new GameMessage('pointerPosition', pointer);

    peer.brodcast(new Message('gameTick', message));
}

const onPlayerJoin = (id) => {
    players.push(new Player(id, id));
};