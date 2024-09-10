import styles from './SearchBar.module.css'

function SearchBar(props) {
    return (
        <form className={styles.form} onSubmit={props.handleSubmit}>
            <div>
                <label htmlFor='search' className={styles.label}></label>
                <input 
                    className={styles.input} 
                    id='search' 
                    type='text' 
                    placeholder='Search...' 
                    name='search' 
                    aria-label='search for tracks' 
                    value={props.searchInput} 
                    onChange={props.handleChange}
                    required
                />
            </div>
            <button className={styles.button} type='submit' aria-label='submit the search'>Search</button>
        </form>
    )
}

export default SearchBar