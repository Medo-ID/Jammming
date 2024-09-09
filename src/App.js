import { useState } from 'react';
import './App.css';
import SearchBar from './SearchBar/SearchBar';
import SearchResult from './SearchResults/SearchResults';
import PlayList from './PlayList/PlayList';

function App() {
  const [counter, setCounter] = useState(1)
  const [searchInput, setSearchInput] = useState("")
  const [tracks, setTracks] = useState([]);
  const [playlist, setPlaylist] = useState([]);

  function handlechange(e) {
    setSearchInput(e.target.value)
  }

  function handleSubmit(e) {
    e.preventDefault()
    setTracks(prev => [...prev, {name: `track ${counter}`, artist: `artist ${counter}`}])
    setCounter(prev => prev + 1)
  }

  function handleAddAction(track) {
    setPlaylist(prev => [...prev, track]);
  }

  function handleRemoveAction(track) {
    setPlaylist(prev => prev.filter(item => item.name !== track.name));
  }

  return (
    <div className="App">
      <h1>Welcome to Jamming</h1>
      <p>Search the Spotify library, create a custom playlist, then save it to your Spotify account</p>
      <SearchBar searchInput={searchInput} handleSubmit={handleSubmit} handleChange={handlechange} />
      <div className='main-section'>
        <SearchResult tracks={tracks} addAction={handleAddAction} />
        <PlayList playlist={playlist} removeAction={handleRemoveAction} />
      </div>
    </div>
  );
}

export default App;
