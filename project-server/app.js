const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express()
dotenv.config();
app.use(bodyParser.json());
    
// defining of directory of static object that you can access
app.use(express.static('public'))

app.post('/login', function (req, res) {
    var user = req.body.username
    var pass = req.body.password
})
app.set('view engine', 'ejs');



// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Failed to connect to MongoDB', err);
});



app.use('/', require('./routes/articles'));
app.listen(8080)