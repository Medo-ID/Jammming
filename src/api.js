export const getTracks = async (query) => {
    const endpoint = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=20`;
    const accessToken = localStorage.getItem('spotify_access_token');
  
    if (!accessToken) {
        console.log('No access token available');
        return;
    }
  
    try {
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            },
        });
    
        if (!response.ok) {
            throw new Error('Failed to fetch tracks');
        }
    
        const data = await response.json();
        const dataNeeded = []

        for (const item of data.tracks.items) {
            dataNeeded.push({
                id: item.id,
                name: item.name,
                artist: item.artists.map(artist => artist.name),
                album: item.album.name,
                uri: item.uri
            })
        }

        return dataNeeded;
    } catch (error) {
        console.log('Error fetching tracks:', error);
    }
};
  