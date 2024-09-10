const clientId = process.env.REACT_APP_CLIENT_ID;
const redirectUrl = 'http://localhost:3000'; 

const authorizationEndpoint = "https://accounts.spotify.com/authorize";
const tokenEndpoint = "https://accounts.spotify.com/api/token";
const scope = 'user-read-private user-read-email';

// Token Management Object
const currentToken = {
  get access_token() { return localStorage.getItem('access_token') || null; },
  get refresh_token() { return localStorage.getItem('refresh_token') || null; },
  get expires_in() { return localStorage.getItem('expires_in') || null; },
  get expires() { return localStorage.getItem('expires') || null; },

  save: function (response) {
    const { access_token, refresh_token, expires_in } = response;
    localStorage.setItem('access_token', access_token);
    if (refresh_token) {
      localStorage.setItem('refresh_token', refresh_token);
    }
    localStorage.setItem('expires_in', expires_in);

    const expiryTime = new Date().getTime() + expires_in * 1000;
    localStorage.setItem('expires', expiryTime);
  }
};

// Authorization Code Flow Logic
export const handleSpotifyAuthorization = async () => {
  const args = new URLSearchParams(window.location.search);
  const code = args.get('code');

  if (code) {
    // If code is found, exchange it for a token
    try {
      const token = await getToken(code);
      currentToken.save(token);

      // Clean URL
      const url = new URL(window.location.href);
      url.searchParams.delete('code');
      const updatedUrl = url.search ? url.href : url.href.replace('?', '');
      window.history.replaceState({}, document.title, updatedUrl);

      window.location.href = redirectUrl; // Redirect to the homepage or another part of your app
    } catch (error) {
      console.error("Error fetching token:", error);
    }
  } else if (!currentToken.access_token) {
    // If no token is found, initiate authorization
    redirectToSpotifyAuthorize();
  } else {
    // User is already logged in
    console.log("User is already logged in");
  }
};

// Redirect to Spotify for Authorization
const redirectToSpotifyAuthorize = async () => {
  const code_verifier = generateRandomString(64);
  const code_challenge = await generateCodeChallenge(code_verifier);

  window.localStorage.setItem('code_verifier', code_verifier);

  const authUrl = new URL(authorizationEndpoint);
  const params = {
    response_type: 'code',
    client_id: clientId,
    scope,
    code_challenge_method: 'S256',
    code_challenge,
    redirect_uri: redirectUrl,
  };

  authUrl.search = new URLSearchParams(params).toString();
  window.location.href = authUrl.toString(); // Redirect the user to the authorization server
};

// Fetch the token using the authorization code
const getToken = async (code) => {
  const code_verifier = localStorage.getItem('code_verifier');

  try {
    const response = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId,
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUrl,
        code_verifier: code_verifier,
      }),
    });

    const tokenData = await response.json();

    if (!response.ok) {
      throw new Error(`Token fetch failed: ${tokenData.error}`);
    }

    return tokenData;
  } catch (error) {
    console.error("Error during token exchange:", error);
  }
};

// Generate a random string for PKCE code_verifier
const generateRandomString = (length) => {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const randomValues = crypto.getRandomValues(new Uint8Array(length));
  return randomValues.reduce((acc, x) => acc + possible[x % possible.length], "");
};

// Generate code challenge from code_verifier
const generateCodeChallenge = async (code_verifier) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(code_verifier);
  const hashed = await crypto.subtle.digest('SHA-256', data);

  return btoa(String.fromCharCode(...new Uint8Array(hashed)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
};

// On page load, initiate the authorization or token exchange flow


