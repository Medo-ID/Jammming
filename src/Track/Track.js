import styles from "./Track.module.css"

function Track(props) {
    const { index, track, isInPlaylist, addAction, removeAction } = props;
    const buttonLabel = isInPlaylist ? "-" : "+";

    const handleClick = () => {
        if (isInPlaylist) {
            removeAction(track); // If in playlist, remove the track
        } else {
            addAction(track); // If in search results, add the track
        }
    }

    return (
        <div className={styles.trackCard} key={index}>
            <div>
                <h3 className={styles.h3}>{track.name}</h3>
                <p className={styles.p}>{track.artist}</p>
            </div>
            <button 
                className={styles.button}
                onClick={handleClick} 
                disabled={props.isAlreadyInPlaylist}
            >
                {buttonLabel}
            </button>
        </div>
    )
}

export default Track