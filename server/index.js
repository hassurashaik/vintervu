require('dotenv').config();
const express = require('express');
const cors = require('cors');
const interviewRoutes = require('./routes/interview');

console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? 'Set' : 'Not set');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/interview', interviewRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});