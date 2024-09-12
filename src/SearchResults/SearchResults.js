import Track from '../Track/Track'
import styles from "./SearchResults.module.css"

function SearchResult(props) {
    return (
        <div className={styles.mainDiv}>
            <h2 className={styles.h2}>Search Result</h2>
            <div className={styles.div}>
                {props.tracks.map(track => {
                    const isAlreadyInPlaylist = props.playlist.some(
                        item => item.name === track.name && item.artist === track.artist
                    )
                    return <Track 
                                key={track.id} 
                                track={track} 
                                addAction={props.addAction} 
                                isInPlaylist={false}
                                isAlreadyInPlaylist={isAlreadyInPlaylist}
                            />
                })}
            </div>
        </div>
    )
}

export default SearchResult