function VoiceAssistant() {
  const speak = (text: string, idiom: string) => {
    const utterance = new SpeechSynthesisUtterance(text)
    speechSynthesis.onvoiceschanged = () => {
      const voices = window.speechSynthesis.getVoices()

      const englishVoice = idiom === 'english' ? voices.find(voice => voice?.name === 'Eddy (English (US))') : null
      const spanishVoice =
        idiom === 'spanish' ? voices.find(voice => voice?.name === 'Grandma (Spanish (Mexico))') : null
      const frenchVoice = idiom === 'french' ? voices.find(voice => voice?.name === 'Grandpa (French (Canada))') : null

      if (englishVoice) utterance.voice = englishVoice
      if (spanishVoice) utterance.voice = spanishVoice
      if (frenchVoice) utterance.voice = frenchVoice

      utterance.volume = 1 // Full volume
      utterance.rate = 0.8 // Normal speed
      utterance.pitch = 1 // Normal pitch

      speechSynthesis.speak(utterance)
    }
  }

  return {
    speak
  }
}

export default VoiceAssistant
