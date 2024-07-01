const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const uri = "mongodb://localhost:27017/ViewTube";
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express()
dotenv.config();
app.use(bodyParser.json());
// Middleware to parse JSON
app.use(express.json());
// defining of directory of static object that you can access

//app.use(express.static('public'))

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '..', 'project-web', 'build')));

// MongoDB connection
mongoose.connect(uri, {
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Failed to connect to MongoDB', err);
});
app.set('view engine', 'ejs');
// User routes
const userRoutes = require('./routes/userRoutes');
app.use('/api', userRoutes);
// Video routes
const videoRoutes = require('./routes/videoRoutes');
app.use('/api', videoRoutes);
// Comment Routes
const commentRoutes = require('./routes/commentRoutes');
app.use('/api', commentRoutes);

// Serve the React app on the root route
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });
// Serve the React app on the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'project-web', 'build', 'index.html'));
  });
app.listen(8080)