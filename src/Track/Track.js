import styles from "./Track.module.css"

function Track(props) {
    const buttonLabel = props.isInPlaylist ? "Remove -" : "Add +";

    const handleClick = () => {
        if (props.isInPlaylist) {
            props.removeAction(props.track); // If in playlist, remove the track
        } else {
            props.addAction(props.track); // If in search results, add the track
        }
    }

    return (
        <div className={styles.trackCard} key={props.index}>
            <div>
                <h3 className={styles.h3}>{props.track.name}</h3>
                <p className={styles.p}>{props.track.artist}</p>
            </div>
            <button className={styles.addButton} onClick={handleClick}>{buttonLabel}</button>
        </div>
    )
}

export default Track