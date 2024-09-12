const clientId = process.env.REACT_APP_CLIENT_ID;
const redirectUri = 'http://localhost:3000';
const scopes = 'user-read-private user-read-email';

// Step 1: Authorization (redirect to Spotify for login)
export const authorizeSpotify = () => {
	const authUrl = `https://accounts.spotify.com/authorize?response_type=token&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}`;
	window.location.href = authUrl;
};

// Step 2: Get Access Token from URL and Store it
export const getAccessTokenFromUrl = () => {
	const hash = window.location.hash;
	if (!hash) return null;

	const params = new URLSearchParams(hash.substring(1));  // Remove '#' and parse the hash
	const token = params.get('access_token');

	if (token) {
		localStorage.setItem('spotify_access_token', token);
		localStorage.setItem('spotify_token_timestamp', Date.now());
		window.history.pushState("", document.title, window.location.pathname);  // Remove token from URL
  	}
};

// Step 3: Check if Token is Expired
export const isTokenExpired = () => {
    const tokenExpirationTime = 3600 * 1000;  // 1 hour
    const tokenTimestamp = localStorage.getItem('spotify_token_timestamp');

    if (!tokenTimestamp) return true;
    return (Date.now() - tokenTimestamp) > tokenExpirationTime;
};