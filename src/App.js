import { useEffect, useState } from 'react';
import './App.css';
import SearchBar from './SearchBar/SearchBar';
import SearchResult from './SearchResults/SearchResults';
import PlayList from './PlayList/PlayList';
import { handleSpotifyAuthorization } from './authorization';

function App() {
	const [counter, setCounter] = useState(1) // Delete when api is working
	const [searchInput, setSearchInput] = useState("")
	const [tracks, setTracks] = useState([]);
	
	const [playlistName, setPlaylistName] = useState("")
	const [playlist, setPlaylist] = useState([]);

	function handleSearchInputChange(e) {
		setSearchInput(e.target.value)
	}
	
	function handlePlaylistNameChange(e) {
		setPlaylistName(e.target.value)
	}

	function handleSubmit(e) {
		e.preventDefault()
		setTracks(prev => [...prev, {name: `track ${counter}`, artist: `artist ${counter}`}])
		setCounter(prev => prev + 1)
		setSearchInput("")
	}

	function handleAddAction(track) {
		setPlaylist(prev => {
			const isTrackInPlaylist = prev.some(item => item.name === track.name && item.artist === track.artist);
			if (!isTrackInPlaylist) {
				return [...prev, track];
			} else {
				return prev;
			}
		});
	}

	function handleRemoveAction(track) {
		setPlaylist(prev => prev.filter(item => item.name !== track.name && item.artist !== track.artist));
	}

	useEffect(() => {
		handleSpotifyAuthorization();
	},);

  	return (
		<div className="App">
			<h1>Welcome to Jamming</h1>
			<p>Search the Spotify library, create a custom playlist, then save it to your Spotify account</p>
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
