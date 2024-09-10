import Track from '../Track/Track'
import styles from './PlayList.module.css'

function PlayList(props) {
    return (
        <div className={styles.mainDiv}>
            <h2 className={styles.h2}>Add Tracks & Create Playlist</h2>
            <input 
                className={styles.input} 
                type='text' 
                placeholder='PlayList Name' 
                aria-label='define a name for your playlist' 
                value={props.playlistName} 
                onChange={props.handleChange} 
                required 
            />
            <div className={styles.tracklist}>
                {props.playlist.map((track, index) => {
                    return <Track key={index} track={track} removeAction={props.removeAction} isInPlaylist={true} />
                })}
            </div>
            <button className={styles.button} disabled={props.playlist.length === 0 || props.playlistName === ""}>Save To Spotify</button>
        </div>
    )
}

export default PlayList