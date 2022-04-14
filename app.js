const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const api = require('./routes/api');
const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(cors());
app.use('/vote', api)
app.listen(process.env.PORT||8123,()=>{
    console.log(`Server Started `)
})