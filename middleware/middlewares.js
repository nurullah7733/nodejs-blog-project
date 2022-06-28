const express = require('express');
const session = require('express-session');
const morgan = require('morgan');
const flash = require('connect-flash');
const config = require('config');
const MongoDBStore = require('connect-mongodb-session')(session);

const { bindUserWithRequest } = require('./authMiddleware');
const setLocals = require('./setLocals');
const app = require('../app');

const database_uri = `mongodb://127.0.0.1:27017/${config.get(
    'db-database-name'
)}`;

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
        secret: config.get('secret-key') || 'secret_key',
        resave: false,
        saveUninitialized: false,
        store: store,
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    }),
    flash(),
    bindUserWithRequest(),
    setLocals(),
];

module.exports = (app) => {
    Middleware.forEach((m) => {
        app.use(m);
    });
};
