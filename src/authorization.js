// Spotify API credentials and settings
const clientId = process.env.REACT_APP_CLIENT_ID;  // Spotify client ID from environment variables
const redirectUri = 'http://localhost:3000';  // Redirect URI for Spotify authorization callback
const scopes = 'playlist-modify-public playlist-modify-private user-read-private user-read-email';  // Permissions requested from Spotify

/**
* Step 1: Redirects the user to Spotify's authorization page for login.
* Constructs the Spotify authorization URL using the client ID, redirect URI, and required scopes,
* then navigates the user to that URL to log in and authorize the app.
*/
export const authorizeSpotify = () => {
    const authUrl = `https://accounts.spotify.com/authorize?response_type=token&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}`;
    window.location.href = authUrl;  // Redirect to Spotify login
};

/**
* Step 2: Extracts the access token from the URL after Spotify authorization.
* Parses the URL hash to retrieve the access token, stores the token and timestamp in localStorage,
* and removes the token from the URL to keep it clean.
*/
export const getAccessTokenFromUrl = () => {
    const hash = window.location.hash;
    if (!hash) return null;

    const params = new URLSearchParams(hash.substring(1));  // Remove '#' and parse the hash
    const token = params.get('access_token');

    if (token) {
        localStorage.setItem('spotify_access_token', token);  // Store the access token
        localStorage.setItem('spotify_token_timestamp', Date.now());  // Store the timestamp of token retrieval
        window.history.pushState("", document.title, window.location.pathname);  // Remove token from the URL to clean it
    }
};

/**
* Step 3: Checks whether the Spotify access token is expired.
* Compares the current time with the time the token was stored in localStorage.
* Tokens expire after 1 hour (3600 seconds), so if more than an hour has passed since the token was stored, it is considered expired.
* @returns {boolean} - True if the token is expired, false if it is still valid.
*/
export const isTokenExpired = () => {
    const tokenExpirationTime = 3600 * 1000;  // 1 hour (3600 seconds in milliseconds)
    const tokenTimestamp = localStorage.getItem('spotify_token_timestamp');  // Retrieve the token timestamp

    if (!tokenTimestamp) return true;  // If no timestamp exists, assume token is expired
    return (Date.now() - tokenTimestamp) > tokenExpirationTime;  // Compare current time with the token timestamp
};