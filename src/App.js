import { useEffect, useState } from 'react';
import './App.css';
import SearchBar from './SearchBar/SearchBar';
import SearchResult from './SearchResults/SearchResults';
import PlayList from './PlayList/PlayList';
import { authorizeSpotify, getAccessTokenFromUrl, isTokenExpired } from './authorization';
import { getTracks, createPlaylist, addTracks } from './api';

function App() {
	const [searchInput, setSearchInput] = useState("");
	const [tracks, setTracks] = useState([]);
	const [playlistName, setPlaylistName] = useState("");
	const [playlist, setPlaylist] = useState([]);
	const [uris, setUris] = useState([]);

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
	};

	const handleAddAction = (track) => {
		// Check if track is already in the playlist to avoid duplicates
		setPlaylist(prev => {
			const isTrackInPlaylist = prev.some(item => item.id === track.id);
			if (!isTrackInPlaylist) {
				setUris(prevUris => [...prevUris, track.uri]);
				return [...prev, track];
			}
			return prev;
		});
	};

	const handleRemoveAction = (track) => {
		setPlaylist(prev => {
			setUris(prevUris => prevUris.filter(uri => uri !== track.uri));
			return prev.filter(item => item.id !== track.id);
		});
	};

	const handleCreatingPlaylist = async () => {
		const token = localStorage.getItem('spotify_access_token');
		
		if (!token) {
			console.error('No access token available. Please log in.');
			return;
		}

		if (!playlistName || uris.length === 0) {
			console.error('Playlist name or track URIs are missing.');
			return;
		}

		try {
			const playlistCreated = await createPlaylist(playlistName);  // Assuming createPlaylist returns a playlist object
			if (playlistCreated && playlistCreated.id) {
				await addTracks(playlistCreated.id, uris);
				console.log('Playlist and tracks added successfully!');
			} else {
				console.error('Failed to create playlist.');
			}
		} catch (error) {
			console.error('Error creating playlist or adding tracks:', error);
		}
	}

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
					handleCreatingPlaylist={handleCreatingPlaylist}
				/>
			</div>
		</div>
	);
}

export default App;