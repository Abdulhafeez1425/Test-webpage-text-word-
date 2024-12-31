// Greeting based on time of day
function setGreeting() {
    const greetingElement = document.getElementById("greeting");
    const hours = new Date().getHours();

    if (hours < 12) {
        greetingElement.innerHTML = "Good Morning!";
    } else if (hours < 18) {
        greetingElement.innerHTML = "Good Afternoon!";
    } else {
        greetingElement.innerHTML = "Good Evening!";
    }
}

// Get available voices
const voicesSelect = document.getElementById('voiceSelect');
let voices = [];

function populateVoices() {
    voices = window.speechSynthesis.getVoices();
    voicesSelect.innerHTML = ''; // Clear any preexisting voices
    voices.forEach((voice, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = voice.name;
        voicesSelect.appendChild(option);
    });
}

if (typeof speechSynthesis !== 'undefined') {
    speechSynthesis.onvoiceschanged = populateVoices;
}

// Text to Speech
const speakButton = document.getElementById('speakButton');
const textInput = document.getElementById('textInput');
const speedControl = document.getElementById('speedControl');
const speedValue = document.getElementById('speedValue');
let speechSynthesisInstance = null;

function speakText() {
    const text = textInput.value.trim();
    const selectedVoiceIndex = voicesSelect.value;
    
    if (text !== '') {
        if (speechSynthesisInstance) {
            window.speechSynthesis.cancel(); // Cancel previous speech
        }

        speechSynthesisInstance = new SpeechSynthesisUtterance(text);
        speechSynthesisInstance.voice = voices[selectedVoiceIndex]; // Use selected voice
        speechSynthesisInstance.rate = speedControl.value;
        window.speechSynthesis.speak(speechSynthesisInstance);
    }
}

speakButton.addEventListener('click', speakText);

speedControl.addEventListener('input', function() {
    speedValue.textContent = `${speedControl.value}x`;
});

// Speech to Text
const startListeningButton = document.getElementById('startListening');
const transcriptElement = document.getElementById('transcript');
let recognition;

if ('webkitSpeechRecognition' in window) {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = function(event) {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
        }
        transcriptElement.textContent = transcript;
    };

    recognition.onerror = function(event) {
        console.error('Speech recognition error:', event);
    };
}

startListeningButton.addEventListener('click', function() {
    if (recognition) {
        recognition.start();
    } else {
        alert("Speech recognition is not supported in this browser.");
    }
});

// Play/Pause Button for Speech
const playPauseButton = document.getElementById('playPauseButton');
let isPaused = false;
let utterance;

playPauseButton.addEventListener('click', function() {
    if (speechSynthesisInstance && !isPaused) {
        window.speechSynthesis.pause();
        playPauseButton.textContent = 'Resume';
        isPaused = true;
    } else if (speechSynthesisInstance && isPaused) {
        window.speechSynthesis.resume();
        playPauseButton.textContent = 'Pause';
        isPaused = false;
    }
});

setGreeting(); // Initialize greeting based on time
populateVoices(); // Populate available voices on load
