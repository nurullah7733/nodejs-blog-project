require('dotenv').config();
const express = require('express');
const session = require('express-session');
const morgan = require('morgan');
const flash = require('connect-flash');
const MongoDBStore = require('connect-mongodb-session')(session);

const { bindUserWithRequest } = require('./authMiddleware');
const setLocals = require('./setLocals');

const database_uri = process.env.DB;

const store = new MongoDBStore({
    uri: database_uri,
    collection: 'mySessions',
});

const Middleware = [
    morgan('dev'),
    express.static('public'),
    express.urlencoded({ extended: true }),
    express.json(),
    session({
        secret: process.env.SECRET_KEY || 'secret-key',
        resave: false,
        saveUninitialized: false,
        store: store,
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    }),
    flash(),
    bindUserWithRequest(),
    setLocals(),
];

// module.exports = (app) => {
//     Middleware.forEach((m) => {
//         app.use(m);
//     });
// };

const setMiddlewares = (app) => {
    app.use(Middleware);
};

module.exports = setMiddlewares;
