async function getLeaderboard() {
    const response = await fetch(`${API_ROUTE}/leaderboard`);

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    const leaderboard = await response.json();
    const leaderboardContainer = document.getElementById('leaderboard-list');
    leaderboardContainer.childNodes.forEach(node => node.remove());

    leaderboard.map(player => {
        leaderboardContainer.insertAdjacentHTML(
            'beforeend',
            `<div class="record">
                    <span>Name: ${player.name}</span>
                    <span>${parseFloat(player.score).toPrecision(3)} points</span>
            </div>`
        );
    })
}