const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

async function generateBasicQuestions() {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not set');
    }
    const timestamp = Date.now();
    const prompt = `Generate 5 simple, concise (1 sentence) introductory interview questions, each separated by a newline... with seed: ${timestamp}.`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text(); // Use text() method
    if (typeof text !== 'string') {
      throw new Error('Response text is not a string');
    }
    return text.split('\n').filter(q => q.trim());
  } catch (error) {
    console.error('Generate basic questions error:', error.message, error.stack);
    throw error;
  }
}

async function generateInitialTechnicalQuestions(skills, branch) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not set');
    }
    const timestamp = Date.now();
    const prompt = skills.length
      ? `Generate 5 simple, concise technical questions for ${branch} based on skills: ${skills.join(', ')}, each separated by a newline... with seed: ${timestamp}.`
      : `Generate 5 simple, concise technical questions for any engineering branch, each separated by a newline... with seed: ${timestamp}.`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text(); // Use text() method
    if (typeof text !== 'string') {
      throw new Error('Response text is not a string');
    }
    return text.split('\n').filter(q => q.trim());
  } catch (error) {
    console.error('Generate initial technical questions error:', error.message, error.stack);
    throw error;
  }
}

async function generateDynamicQuestion(responses, skills, branch) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not set');
    }
    const timestamp = Date.now();
    const prompt = `Based on responses: '${responses.join(' ')}', generate a technical question for ${branch}... with seed: ${timestamp}.`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text(); // Use text() method
    if (typeof text !== 'string') {
      throw new Error('Response text is not a string');
    }
    return text.trim();
  } catch (error) {
    console.error('Generate dynamic question error:', error.message, error.stack);
    throw error;
  }
}

module.exports = {
  generateBasicQuestions,
  generateInitialTechnicalQuestions,
  generateDynamicQuestion,
};