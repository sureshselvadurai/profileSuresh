const path = require('path');
const config = require('../modules/config');
const readCSV = require('../modules/csvReader');
const fs = require('fs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const connectDB = require('../modules/db');

function renderPage(res, template, additionalData = {}) {
  const data = {
    appName: config.appName,
    ...additionalData,
  };
  res.render(template, data);
}

mongoose.set('strictQuery', false);

module.exports = function (app) {
  // Connect to DB and use bodyParser
  connectDB(true);
  app.use(bodyParser.urlencoded({ extended: true }));

  // Load and define model
  const querySchema = new mongoose.Schema({
    message: String,
    DateTime: String,
  });

  app.get('/', (req, res) => {
    // Fetch and sort posts data
    const postsData = readCSV('./private/data/posts.csv');
    const sortedPostsData = postsData.sort((a, b) => new Date(a.timeAgo) - new Date(b.timeAgo));
    renderPage(res, 'main', { posts: sortedPostsData });
  });

  app.get('/contact', (req, res) => {
    renderPage(res, 'contact');
  });

  app.get('/profile', (req, res) => {
    renderPage(res, 'profile');
  });

  app.get('/projects', (req, res) => {
    renderPage(res, 'projects');
  });

  app.get('/resume', (req, res) => {
    renderPage(res, 'resume');
  });

  // Routing
  app.post('/addQuery', (req, res) => {
    // Query DB setup
    const Query = mongoose.model('Query', querySchema);
    const FormData = new Query(req.body);
    FormData.DateTime = new Date().toLocaleString();
    console.log(req.body);
    console.log(FormData);
    FormData.save().then(() => {
      console.log('Data saved successfully.');
    });
  });

  // Close DB
  app.post('/closeDB', (req, res) => {
    connectDB(false);
  });

  app.get('/getpdf', (req, res) => {
    // Read PDF and send as base64
    const pdfPath = './private/data/Resume SureshSelvadurai.pdf';
    const dataBuffer = fs.readFileSync(pdfPath);
    const pdfText = dataBuffer.toString('base64');
    res.json({ pdfText });
  });
};
