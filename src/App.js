import { useEffect, useState } from 'react';
import './App.css';
import SearchBar from './SearchBar/SearchBar';
import SearchResult from './SearchResults/SearchResults';
import PlayList from './PlayList/PlayList';
import { authorizeSpotify, getAccessTokenFromUrl, isTokenExpired } from './authorization';
import { getTracks, createPlaylist, addTracks } from './api';

/**
 * Main component for the Jamming app. 
 * Handles the state and logic for searching Spotify tracks, creating playlists, and adding/removing tracks.
 */
function App() {
	// State variables to store search input, search results (tracks), playlist details, and track URIs for creating the playlist
	const [searchInput, setSearchInput] = useState("");
	const [tracks, setTracks] = useState([]);
	const [playlistName, setPlaylistName] = useState("");
	const [playlist, setPlaylist] = useState([]);
	const [uris, setUris] = useState([]);

	/**
	* Updates the search input state when the user types in the search bar.
	* @param {Object} e - Event object from input change
	*/
	const handleSearchInputChange = (e) => setSearchInput(e.target.value);

	/**
	* Updates the playlist name when the user types a new name.
	* @param {Object} e - Event object from input change
	*/
	const handlePlaylistNameChange = (e) => setPlaylistName(e.target.value);

	/**
	* Handles the form submission to search for tracks using the Spotify API.
	* Validates the input and checks if the access token exists before making the API request.
	* @param {Object} e - Event object from form submission
	*/
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (searchInput.trim()) {
			const token = localStorage.getItem('spotify_access_token');
			if (token) {
				const result = await getTracks(searchInput);  // Fetch tracks based on search input
				if (result) setTracks(result);
			} else {
				alert('No access token available. Please log in.');
			}
		}
	};

	/**
	* Adds a track to the playlist. Checks if the track already exists in the playlist to avoid duplicates.
	* Also adds the track's URI to the uris state for playlist creation.
	* @param {Object} track - Track object containing track details (e.g., id, uri)
	*/
	const handleAddAction = (track) => {
		setPlaylist(prev => {
			const isTrackInPlaylist = prev.some(item => item.id === track.id);
			if (!isTrackInPlaylist) {
				// Add URI to uris state
				setUris(prevUris => {
					// Prevent duplicate URIs
					if (!prevUris.includes(track.uri)) {
						return [...prevUris, track.uri];
					}
					return prevUris;
				});
				return [...prev, track];  // Add track to playlist state
			}
			return prev;
		});
	};

	/**
	* Removes a track from the playlist. Removes the track's URI from the uris state.
	* @param {Object} track - Track object containing track details (e.g., id, uri)
	*/
	const handleRemoveAction = (track) => {
		setPlaylist(prev => {
			setUris(prevUris => prevUris.filter(uri => uri !== track.uri));  // Remove URI from uris state
			return prev.filter(item => item.id !== track.id);  // Remove track from playlist state
		});
	};

	/**
	* Handles the creation of a new Spotify playlist for the user and adds selected tracks to the playlist.
	* It first creates the playlist, then adds the URIs to the created playlist.
	*/
	const handleCreatingPlaylist = async () => {
		const token = localStorage.getItem('spotify_access_token');
		
		if (!token) {
			alert('No access token available. Please log in.');
			return;
		}

		if (!playlistName || uris.length === 0) {
			alert('Playlist name or track URIs are missing.');
			return;
		}

		try {
			const playlistCreated = await createPlaylist(playlistName);  // Create the new playlist
			if (playlistCreated && playlistCreated.id) {
				await addTracks(playlistCreated.id, uris);  // Add tracks to the playlist
				alert(`${playlistName} is created Successfully with selected songs, check your Spotify account!`)
				// Reset playlist, playlistName and uris after successful creation
				setPlaylistName("")
				setPlaylist([]);
				setUris([]);
			} else {
				alert('Failed to create playlist.');
			}
		} catch (error) {
			alert('Error creating playlist or adding tracks:', error);
		}
	};

	/**
	* Effect hook that runs when the app loads. It checks if there's a valid Spotify access token
	* and retrieves it from the URL if needed.
	*/
	useEffect(() => {
		getAccessTokenFromUrl();  // Retrieve token from URL after Spotify redirects back

		const storedToken = localStorage.getItem('spotify_access_token');
		const tokenExpired = isTokenExpired();

		if (!storedToken || tokenExpired) {
			authorizeSpotify();  // Redirect to Spotify authorization if no valid token is found
		}
	}, []);

  	return (
		<div className="App">
			<header>
				<img className='logo' src='./logo512.png' alt='Jamming main logo' />
				<h1>Welcome to Jamming</h1>
			</header>
			<p className='app-description'>
				Search the Spotify library, create a custom playlist, then save it to your Spotify account.
			</p>
			{/* Search Bar Component */}
			<SearchBar
				searchInput={searchInput}
				handleSubmit={handleSubmit}
				handleChange={handleSearchInputChange}
			/>
			<div className='main-section'>
				{/* Search Results Component */}
				<SearchResult
					tracks={tracks}
					addAction={handleAddAction}
					playlist={playlist}
				/>
				{/* Playlist Component */}
				<PlayList
					playlist={playlist}
					playlistName={playlistName}
					handleChange={handlePlaylistNameChange}
					removeAction={handleRemoveAction}
					handleCreatingPlaylist={handleCreatingPlaylist}
				/>
			</div>
		</div>
  	);
}

export default App;