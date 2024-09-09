import Track from '../Track/Track'
import styles from './PlayList.module.css'

function PlayList(props) {
    return (
        <div className={styles.mainDiv}>
            <h2 className={styles.h2}>Add Tracks to create playlist</h2>
            <input type='text' placeholder='PlayList Name' aria-label='define a name for your playlist' required />
            <div className={styles.tracklist}>
                {props.playlist.map((track, index) => {
                    return <Track key={index} track={track} removeAction={props.removeAction} isInPlaylist={true} />
                })}
            </div>
            <button>Save To Spotify</button>
        </div>
    )
}

export default PlayList