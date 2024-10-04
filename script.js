

const fileInput = document.getElementById('file-input');
const songListElement = document.getElementById('song-list');
const playPauseButton = document.getElementById('play-pause');
const prevButton = document.getElementById('prev');
const nextButton = document.getElementById('next');
const sortAlphaButton = document.getElementById('sort-alpha');
const sortMostPlayedButton = document.getElementById('sort-most-played');
const albumCover = document.getElementById('album-cover');
const songNameElement = document.getElementById('song-name');

let songs = [];
let currentSongIndex = 0;
let isPlaying = false;
let audio = null;
let playCount = {};

// Default cover image
const defaultCover = 'default-cover.jpg';

// Handle file selection
fileInput.addEventListener('change', function(event) {
    const files = event.target.files;
    songs = Array.from(files).map(file => ({
        name: file.name,
        file: file,
        timesPlayed: 0,
        cover: defaultCover // Assign default cover if none exists
    }));
    displaySongList();
});

// Display the song list
function displaySongList() {
    songListElement.innerHTML = '';
    songs.forEach((song, index) => {
        const li = document.createElement('li');
        li.textContent = song.name;
        li.addEventListener('click', () => loadSong(index));
        songListElement.appendChild(li);
    });
}

// Load the selected song
function loadSong(index) {
    currentSongIndex = index;

    // Stop the current audio if any
    if (audio) {
        audio.pause();
    }

    // Load new song
    const song = songs[index];
    audio = new Audio(URL.createObjectURL(song.file));
    audio.addEventListener('ended', nextSong);

    // Update song details
    songNameElement.textContent = song.name;
    albumCover.src = song.cover; // Use default cover if none exists
    playCount[song.name] = (playCount[song.name] || 0) + 1;

    // Start playing
    audio.play();
    isPlaying = true;
    updatePlayPauseButton();
}

// Play or pause the song
function togglePlayPause() {
    if (isPlaying) {
        audio.pause();
    } else {
        audio.play();
    }
    isPlaying = !isPlaying;
    updatePlayPauseButton();
}

// Update play/pause button UI
function updatePlayPauseButton() {
    playPauseButton.textContent = isPlaying ? '⏸️' : '▶️';
}

// Next and previous song
function nextSong() {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    loadSong(currentSongIndex);
}

function prevSong() {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    loadSong(currentSongIndex);
}

// Sort songs alphabetically
sortAlphaButton.addEventListener('click', () => {
    songs.sort((a, b) => a.name.localeCompare(b.name));
    displaySongList();
});

// Sort songs by most played
sortMostPlayedButton.addEventListener('click', () => {
    songs.sort((a, b) => (playCount[b.name] || 0) - (playCount[a.name] || 0));
    displaySongList();
});

// Button event listeners
playPauseButton.addEventListener('click', togglePlayPause);
nextButton.addEventListener('click', nextSong);
prevButton.addEventListener('click', prevSong);
