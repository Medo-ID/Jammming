import { useEffect, useState } from 'react';
import './App.css';
import SearchBar from './SearchBar/SearchBar';
import SearchResult from './SearchResults/SearchResults';
import PlayList from './PlayList/PlayList';
import { authorizeSpotify, getAccessTokenFromUrl, isTokenExpired } from './authorization';
import { getTracks } from './api';

function App() {
	const [searchInput, setSearchInput] = useState("");
	const [tracks, setTracks] = useState([]);
	const [playlistName, setPlaylistName] = useState("");
	const [playlist, setPlaylist] = useState([]);

	const handleSearchInputChange = (e) => {
		setSearchInput(e.target.value);
	};

	const handlePlaylistNameChange = (e) => {
		setPlaylistName(e.target.value);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (searchInput.trim()) {
			const token = localStorage.getItem('spotify_access_token');
			if (token) {
				const result = await getTracks(searchInput);
				if (result) {
					setTracks(result);
				}
			} else {
				console.error('No access token available. Please log in.');
			}
		}
		// setSearchInput("");
	};

	const handleAddAction = (track) => {
		setPlaylist((prev) => {
			const isTrackInPlaylist = prev.some(item => item.id === track.id);
			if (!isTrackInPlaylist) {
				return [...prev, track];
			} else {
				return prev;
			}
		});
	};

	const handleRemoveAction = (track) => {
		setPlaylist((prev) => prev.filter(item => item.id !== track.id));
	};

	useEffect(() => {
		getAccessTokenFromUrl();

		const storedToken = localStorage.getItem('spotify_access_token');
		const tokenExpired = isTokenExpired();

		if (!storedToken || tokenExpired) {
			authorizeSpotify();
		} else {
			console.log("Token is valid. You can now make Spotify API requests.");
		}
	}, []);

	return (
		<div className="App">
			<h1>Welcome to Jamming</h1>
			<p className='app-description'>Search the Spotify library, create a custom playlist, then save it to your Spotify account</p>
			<p>{playlistName}</p>
			<SearchBar
				searchInput={searchInput}
				handleSubmit={handleSubmit}
				handleChange={handleSearchInputChange}
			/>
			<div className='main-section'>
				<SearchResult
				tracks={tracks}
				addAction={handleAddAction}
				playlist={playlist}
				/>
				<PlayList
				playlist={playlist}
				playlistName={playlistName}
				handleChange={handlePlaylistNameChange}
				removeAction={handleRemoveAction}
				/>
			</div>
		</div>
	);
}

export default App;