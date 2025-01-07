document.addEventListener('DOMContentLoaded', function() {
    const channelsContainer = document.getElementById('channels-container');
    const loadingSpinner = document.getElementById('loading-spinner');

    function fetchM3U() {
        loadingSpinner.style.display = 'block';
        
        fetch('in.m3u')  //check it again for error
            .then(response => response.text())
            .then(data => {
                const m3uChannels = parseM3U(data);
                displayChannels(m3uChannels);
                loadingSpinner.style.display = 'none';
            })
            .catch(error => {
                console.error('Error fetching channels:', error);
                loadingSpinner.style.display = 'none';
            });
    }

    function parseM3U(data) {
        const channels = [];
        const lines = data.split('\n');
        
        lines.forEach(line => {
            if (line.trim() && !line.startsWith('#')) {
                const [name, url] = line.split(',');
                channels.push({ name, url });
            }
        });

        return channels;
    }

    function displayChannels(channels) {
        channelsContainer.innerHTML = channels.map(channel => `
            <div class="channel">
                <img src="${channel.thumbnail || 'default-thumbnail.jpg'}" alt="${channel.name}" />
                <div class="channel-info">
                    <div class="channel-title">${channel.name}</div>
                    <div class="channel-action">
                        <button onclick="playChannel('${channel.url}')">Watch</button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    function playChannel(url) {
        const player = document.createElement('video');
        player.src = url;
        player.controls = true;
        document.body.appendChild(player);
        player.play();
    }

    // Fetch the M3U file on load
    fetchM3U();
});
