const apiSpotify = 'https://api.spotify.com/v1/'

// Fetch tracks based on the user query
export const getTracks = async (query) => {
    const endpoint = `${apiSpotify}search?q=${encodeURIComponent(query)}&type=track&limit=20`;
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

// Fetch current user info to get their ID
const getCurrentUserId = async () => {
    const accessToken = localStorage.getItem('spotify_access_token');
    const endpoint = `${apiSpotify}me`;
  
    try {
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
    
        if (!response.ok) {
            throw new Error('Failed to get user info.');
        }
    
        const data = await response.json();
        return data.id;  // Return the user ID
    } catch (error) {
        console.error('Error fetching current user:', error);
    }
};

// Function to create a new playlist
export const createPlaylist = async (playlistName) => {
    const accessToken = localStorage.getItem('spotify_access_token');
    const userId = await getCurrentUserId();
  
    if (!userId) {
        console.error('Could not retrieve user ID.');
        return;
    }
  
    const endpoint = `${apiSpotify}users/${userId}/playlists`;
  
    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: playlistName,
                description: "New playlist description",
                public: false
            })
        });
  
        if (!response.ok) {
            throw new Error('Failed to create playlist.');
        }
  
        const playlistData = await response.json();
        console.log('Playlist Created successfully:', playlistData);
        return playlistData;
    } catch (error) {
        console.error('Error while creating new playlist:', error);
    }
};

// Function to add tracks to the new playlist created
export const addTracks = async (playlist_id, uris) => {
    const accessToken = localStorage.getItem('spotify_access_token');

    if (!accessToken) {
        console.error('No access token available');
        return;
    }

    if (!playlist_id || uris.length === 0) {
        console.error('Invalid playlist_id or empty track URIs');
        return;
    }

    const endpoint = `${apiSpotify}playlists/${playlist_id}/tracks`;

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                uris: uris,
            })
        });

        if (!response.ok) {
            throw new Error('Failed to add tracks to playlist.');
        }

        const tracksAdded = await response.json();
        console.log('Tracks added successfully:', tracksAdded);
    } catch (error) {
        console.error('Error while adding tracks:', error);
    }
};