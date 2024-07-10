const express = require('express');
const path = require('path');
//const uri = "mongodb://localhost:27017/ViewTube";
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express()
// Construct the absolute path to the .env file
const envPath = path.join(__dirname, 'config', '.env');
// Import the dotenv package
const dotenv = require('dotenv');
// Configure dotenv to load the .env file from the 'config' folder
dotenv.config({ path: envPath });
app.use(bodyParser.json());
// Middleware to parse JSON
app.use(express.json());
// defining of directory of static object that you can access
//app.use(express.static('public'))
// Serve static files from the React app
app.use(express.static(path.join(__dirname, '..', 'project-web', 'build')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
}).then(() => {
    const dbName = mongoose.connection.name;
    console.log(`Connected to MongoDB. database: ${dbName}`);
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

//for debugging
//const indexPath = path.join(__dirname, '..', 'project-web', 'build', 'index.html');
//for running from public
const indexPath = path.join(__dirname, 'public', 'index.html');

app.get('/', (req, res) => {
    res.sendFile(indexPath);
});
const appRoutes = require('./routes/appRoutes')
app.use("/",appRoutes)

app.listen(process.env.PORT)
console.debug("Listening To " + process.env.PORT)