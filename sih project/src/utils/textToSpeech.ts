export const speak = (text: string) => {
  if ('speechSynthesis' in window) {
    // Cancel any ongoing speech first
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    // Set TTS options
    utterance.rate = 1; // Set playback speed
    utterance.pitch = 1; // Set pitch
    utterance.volume = 1;

    // Get available voices and select a stable single voice
    const voices = window.speechSynthesis.getVoices();
    const consistentVoice = voices.find(voice => voice.lang === 'en-IN'); // Ensure the same voice is used

    if (consistentVoice) {
      utterance.voice = consistentVoice;
    }

    window.speechSynthesis.speak(utterance); // Speak the entire text
  } else {
    console.error('Speech synthesis not supported in this browser.');
  }
};