const apiSpotify = 'https://api.spotify.com/v1/';

/**
* Fetches tracks from the Spotify API based on the user search query.
* @param {string} query - Search query input by the user.
* @returns {Array} - Array of track objects containing track ID, name, artist, album, and URI.
*/
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
        const tracks = data.tracks.items.map(item => ({
            id: item.id,
            name: item.name,
            artist: item.artists.map(artist => artist.name).join(', '),
            album: item.album.name,
            uri: item.uri
        }));

        return tracks;
    } catch (error) {
        console.log('Error fetching tracks:', error);
    }
};

/**
* Fetches the current Spotify user's ID.
* @returns {string} - The Spotify user ID.
*/
const getCurrentUserId = async () => {
    const accessToken = localStorage.getItem('spotify_access_token');
    const endpoint = `${apiSpotify}me`;
  
    if (!accessToken) {
        console.log('No access token available');
        return;
    }
  
    try {
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
    
        if (!response.ok) {
            throw new Error('Failed to get user info.');
        }
    
        const data = await response.json();
        return data.id;  // Return user ID
    } catch (error) {
        console.error('Error fetching current user:', error);
    }
};

/**
* Creates a new playlist for the current user.
* @param {string} playlistName - The name of the new playlist to be created.
* @returns {Object} - Playlist object containing playlist details (e.g., id, name).
*/
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
                'Content-Type': 'application/json',
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
        return playlistData;
    } catch (error) {
        console.error('Error while creating new playlist:', error);
    }
};

/**
* Adds tracks to an existing playlist.
* @param {string} playlist_id - ID of the playlist to which tracks will be added.
* @param {Array} uris - Array of track URIs to be added to the playlist.
*/
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
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ uris })
        });

        if (!response.ok) {
            throw new Error('Failed to add tracks to playlist.');
        }
        console.log('Tracks added successfully');
    } catch (error) {
        console.error('Error while adding tracks:', error);
    }
};