import Track from '../Track/Track'
import styles from "./SearchResults.module.css"

function SearchResult(props) {
    return (
        <div className={styles.mainDiv}>
            <h2 className={styles.h2}>Search Result</h2>
            <div className={styles.div}>
                {props.tracks.map((track, index) => {
                    return <Track key={index} track={track} addAction={props.addAction} isInPlaylist={false} />
                })}
            </div>
        </div>
    )
}

export default SearchResult