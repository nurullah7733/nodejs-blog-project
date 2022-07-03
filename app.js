require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const config = require('config');

// Import Middleware
const Middlewares = require('./middleware/middlewares');
// Import Router
const Routes = require('./routers/routes');

const app = express();

// set view engine
app.set('view engine', 'ejs');
app.set('views', 'views');

const database_uri = `mongodb+srv://nur:nur1234@cluster0.y610b.mongodb.net/blog-project`;

// db connect
const option = { user: '', pass: '' };
mongoose.connect(database_uri, option, (err, success) => {
    if (err) {
        console.log('database connect fail');
    } else {
        console.log('database connect success');
    }
});

// Using Middleware
Middlewares(app);
// * Using Routes
Routes(app);
// 404 not found

app.use((req, res, next) => {
    const error = new Error('404 Not Found');
    error.status = 404;
    next(error);
});
app.use((error, req, res, next) => {
    if (error) {
        res.render('./pages/error/404');
    } else {
        console.log(error);
        res.render('./pages/error/500');
    }
});

module.exports = app;
