const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const dotenv = require('dotenv').config();
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
// Router
const authRouter = require('./routers/authRouter');
const dashobardRouter = require('./routers/dashboardRouter');

// Middleware
const { bindUserWithRequest } = require('./middleware/authMiddleware');
const getSetLocals = require('./middleware/setLocals');

const app = express();

// set view engine
app.set('view engine', 'ejs');
app.set('views', 'views');

const database_uri = 'mongodb://127.0.0.1:27017/blogProject';

const store = new MongoDBStore({
    uri: database_uri,
    collection: 'mySessions',
    maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
});

// Middleware
const Middleware = [
    morgan('dev'),
    express.static('public'),
    express.urlencoded({ extended: true }),
    express.json(),
    session({
        secret: process.env.SECRET_KEY || 'secret_key',
        resave: false,
        saveUninitialized: false,
        store: store,
    }),
    bindUserWithRequest(),
    getSetLocals(),
];
app.use(Middleware);

// db connect

const option = { user: '', pass: '' };

mongoose.connect(database_uri, option, (err, success) => {
    if (err) {
        console.log('database connect fail');
    } else {
        console.log('database connect success');
    }
});

app.use('/auth', authRouter);
app.use('/dashboard', dashobardRouter);

app.get('/', (req, res) => {
    res.render('pages/auth/signup.ejs', {
        title: 'Sign up  ',
        errors: {},
        value: {},
    });
});

module.exports = app;
