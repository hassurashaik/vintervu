const say = require('say');

async function recognizeSpeech(text) {
  try {
    // Return the transcribed text directly (sent from frontend)
    if (!text) {
      throw new Error('No speech input provided');
    }
    return text;
  } catch (error) {
    console.error('Recognize speech error:', error.message, error.stack);
    throw error;
  }
}

async function synthesizeSpeech(text) {
  try {
    return new Promise((resolve, reject) => {
      say.speak(text, null, 1.0, err => {
        if (err) reject(err);
        else resolve();
      });
    });
  } catch (error) {
    console.error('Synthesize speech error:', error.message, error.stack);
    throw error;
  }
}

module.exports = { recognizeSpeech, synthesizeSpeech };