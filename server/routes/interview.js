const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: 'Uploads/',
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});
const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== '.pdf' && ext !== '.docx') {
      return cb(new Error('Only PDF and DOCX files are allowed'));
    }
    cb(null, true);
  },
});

const { processResume } = require('../services/resumeProcessor');
const { startInterview, getNextQuestion, recordResponse, endInterview, getResults } = require('../services/interviewService');

router.post('/upload-resume', upload.single('resume'), async (req, res) => {
  try {
    console.log('Upload request:', { file: req.file });
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Process the resume and extract skills, projects, and branch
    const { skills, projects, branch } = await processResume(req.file.path);
    console.log('Resume processed:', { skills, projects, branch });

    // Send the extracted data back to the client
    res.json({ skills, projects, branch });
  } catch (error) {
    console.error('Upload error:', error.message, error.stack);
    res.status(500).json({ error: 'Failed to process resume', details: error.message });
  }
});


router.post('/start', async (req, res) => {
  try {
    const { skills, branch } = req.body;
    console.log('Start interview:', { skills,  branch });
    await startInterview(skills, branch);
    res.json({ message: 'Interview started' });
  } catch (error) {
    console.error('Start interview error:', error.message, error.stack);
    res.status(500).json({ error: 'Failed to start interview', details: error.message });
  }
});

router.get('/next-question', async (req, res) => {
  try {
    const question = await getNextQuestion();
    console.log('Next question sent:', question);
    res.json({ question });
  } catch (error) {
    console.error('Next question error:', error.message, error.stack);
    res.status(500).json({ error: 'Failed to fetch question', details: error.message });
  }
});

router.post('/record-response', async (req, res) => {
  try {
    const { audio, question } = req.body;
    console.log('Received record request:', { audio, question });
    if (!audio && audio !== '') {
      console.error('No audio provided');
      return res.status(400).json({ error: 'No audio provided' });
    }
    const result = await recordResponse(audio, question);
    console.log('Record response sent:', result);
    res.json(result);
  } catch (error) {
    console.error('Record response error:', error.message, error.stack);
    res.status(500).json({ error: 'Failed to record response', details: error.message });
  }
});

router.post('/end-interview', async (req, res) => {
  try {
    const results = await endInterview();
    console.log('End interview results sent:', results);
    res.json(results);
  } catch (error) {
    console.error('End interview error:', error.message, error.stack);
    res.status(500).json({ error: 'Failed to end interview', details: error.message });
  }
});

router.get('/results', async (req, res) => {
  try {
    const results = await getResults();
    console.log('Results sent:', results);
    res.json(results);
  } catch (error) {
    console.error('Results error:', error.message, error.stack);
    res.status(500).json({ error: 'Failed to fetch results', details: error.message });
  }
});

module.exports = router;