

const fileInput = document.getElementById('file-input');
const fetchSongsButton = document.getElementById('fetch-songs');
const songListElement = document.getElementById('song-list');
const playPauseButton = document.getElementById('play-pause');
const prevButton = document.getElementById('prev');
const nextButton = document.getElementById('next');
const sortAlphaButton = document.getElementById('sort-alpha');
const sortMostPlayedButton = document.getElementById('sort-most-played');
const albumCover = document.getElementById('album-cover');
const songNameElement = document.getElementById('song-name');
const seekbar = document.getElementById('seekbar');

let songs = [];
let currentSongIndex = 0;
let isPlaying = false;
let audio = null;
let playCount = {};
let seekbarUpdateInterval = null;

// Default cover image
const defaultCover = 'default-cover.jpg';

// Handle fetching songs from the device
fetchSongsButton.addEventListener('click', function () {
    fileInput.click(); // Simulate click on file input
});

// Handle multiple file selection and add to list
fileInput.addEventListener('change', function (event) {
    const files = event.target.files;
    songs = Array.from(files).map(file => ({
        name: file.name,
        file: file,
        timesPlayed: 0,
        cover: defaultCover // Assign default cover if none exists
    }));

    // Hide fetch button and file input after songs are fetched
    fileInput.style.display = 'none';
    fetchSongsButton.style.display = 'none';

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
        clearInterval(seekbarUpdateInterval);
    }

    // Load new song
    const song = songs[index];
    audio = new Audio(URL.createObjectURL(song.file));
    audio.addEventListener('ended', nextSong);

    // Update song details
    songNameElement.textContent = song.name;
    albumCover.src = song.cover;
    playCount[song.name] = (playCount[song.name] || 0) + 1;

    // Start playing
    audio.play();
    isPlaying = true;
    updatePlayPauseButton();
    
    // Update seekbar based on song progress
    audio.addEventListener('timeupdate', updateSeekbar);
    
    // Start the seekbar update interval
    seekbarUpdateInterval = setInterval(updateSeekbar, 1000);
}

// Play or pause the song
function togglePlayPause() {
    if (isPlaying) {
        audio.pause();
        clearInterval(seekbarUpdateInterval);
    } else {
        audio.play();
        seekbarUpdateInterval = setInterval(updateSeekbar, 1000);
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

// Seekbar control
seekbar.addEventListener('input', function() {
    if (audio) {
        const seekTo = audio.duration * (seekbar.value / 100);
        audio.currentTime = seekTo;
    }
});

// Update seekbar as song progresses
function updateSeekbar() {
    if (audio && !isNaN(audio.duration)) {
        const currentTime = audio.currentTime;
        const duration = audio.duration;
        const percentage = (currentTime / duration) * 100;
        seekbar.value = percentage;
    }
}

// Button event listeners
playPauseButton.addEventListener('click', togglePlayPause);
nextButton.addEventListener('click', nextSong);
prevButton.addEventListener('click', prevSong);
