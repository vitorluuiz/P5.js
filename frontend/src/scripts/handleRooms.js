const peer = new CustomPeer();

async function getRooms() {
    const response = await fetch(`${API_ROUTE}/rooms`);

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    const rooms = await response.json();
    const roomsContainer = document.getElementById('rooms-list');
    roomsContainer.childNodes.forEach(node => node.remove());

    rooms.map(room => {
        roomsContainer.insertAdjacentHTML(
            'beforeend',
            `<div class="room">
                <div class="room-info">
                    <span>id: ${room.id}</span>
                    <span>${room.players.length} players</span>
                </div>
                <a href="#" onclick="joinRoom('${room.id}')">Join</a>
            </div>`
        );
    })
};

async function createRoom() {
    const id = await peer.idPromise;
    const body = { ownerName: 'Player', id };

    fetch(`${API_ROUTE}/rooms/room`, {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify(body)
    }).then((response) => {
        console.log(response);
    })
    // send to server my room infos
}

function joinRoom(id) {
    peer.connectToPeer(id);
    // send to server my player infos
}