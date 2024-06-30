const express = require('express');
const dotenv = require('dotenv');
const uri = "mongodb://localhost:27017/ViewTube";
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express()
dotenv.config();
app.use(bodyParser.json());
// Middleware to parse JSON
app.use(express.json());
// defining of directory of static object that you can access
app.use(express.static('public'))
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
app.use('/api/users', userRoutes);
// Video routes
const videoRoutes = require('./routes/videoRoutes');
app.use('/api', videoRoutes);
app.listen(8080)