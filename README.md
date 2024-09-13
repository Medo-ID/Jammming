# Jamming - A Spotify Playlist Creator

**Jamming** is a web application that allows users to search for songs from the Spotify library, create custom playlists, and save them directly to their Spotify account. The app is built with React and utilizes Spotify's Web API for searching and managing playlists.

## Features

- **Search Songs**: Search for tracks from Spotify's vast music library.
- **Create Playlists**: Add tracks to a custom playlist and give it a unique name.
- **Save Playlists**: Save the created playlist directly to your Spotify account.
- **Responsive Design**: The app is designed to work seamlessly on different screen sizes.

## Technologies Used

- **React**: For building the user interface.
- **Spotify API**: To handle music search, playlist creation, and song management.
- **JavaScript (ES6+)**: For logic and API handling.
- **HTML5 & CSS3**: For layout and styling.
- **OAuth 2.0 PKCE Flow /  Implicit Grant Flow**: For secure authorization with Spotify.

## Prerequisites
Before you begin, ensure you have met the following requirements:
- You have a Spotify account.
- You have registered a Spotify app at the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard) and obtained:
 - **Client ID**
 - **Redirect URI**
- [Node.js](https://nodejs.org/en) and npm installed on your machine.

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/Medo-ID/Jammming.git

2. Navigate to the project directory:
    ```bash
    cd Jammming

3. Install the necessary dependencies:
   ```bash
   npm install

4. Create a .env file in the root of the project and add your Spotify credentials:
   ```bash
   REACT_APP_CLIENT_ID=your_spotify_client_id

5. Start the development server:
   ```bash
   npm start

## Usage

1. Open your browser and navigate to http://localhost:3000.
2. Log in to your Spotify account and authorize the app.
3. Use the search bar to find tracks.
4. Add tracks to your playlist.
5. Create and save the playlist to your Spotify account.

## File Structure

```php
├── public
│   └── index.html
├── src
│   ├── App.js                # Main application component
│   ├── api.js                # Functions to interact with Spotify API
│   ├── authorization.js      # Spotify Authorization logic
│   ├── SearchBar/            # Search bar component
│   ├── SearchResults/        # Display search results
│   ├── PlayList/             # Playlist management component
│   └── App.css               # Styling for the app
└── README.md                 # Project documentation
```

## Troubleshooting

- **403 Forbidden Error**: Ensure you have the correct scopes (playlist-modify-public and playlist-modify-private) and the access token is valid.
- **Duplicate Tracks in Playlist**: This issue may occur due to adding the same track multiple times. Check your playlist handling logic to ensure duplicates are not added.

## Contributing

Contributions are welcome! Please fork this repository and submit a pull request with any improvements, bug fixes, or new features.

## License
This project is open source and available under the MIT License.