import axios from 'axios';

const API_KEY = '347f728535msh62ce096affca0dfp16888ejsne1032db37b88'; // Replace with your API key

export const translateText = async (text: string, targetLang: string): Promise<string> => {
  const url = `https://translation.googleapis.com/language/translate/v2`;

  try {
    const response = await axios.post(url, null, {
      params: {
        q: text,
        target: targetLang,
        key: API_KEY,
      },
    });
    return response.data.data.translations[0].translatedText;
  } catch (error) {
    console.error('Translation error:', error);
    return text; // Return original text if translation fails
  }
};
