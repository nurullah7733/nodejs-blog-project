const authRouter = require('./authRouter');
const dashboardRouter = require('./dashboardRouter');
const uploadRouter = require('./uploadRouter');
const postRouter = require('./postRoute');
const apiRoutes = require('../api/routes/apiRoutes');
const explorerRoutes = require('./explorerRoute');
const routes = [
    {
        path: '/auth',
        handler: authRouter,
    },
    {
        path: '/dashboard',
        handler: dashboardRouter,
    },
    {
        path: '/uploads',
        handler: uploadRouter,
    },
    {
        path: '/post',
        handler: postRouter,
    },
    {
        path: '/explorer',
        handler: explorerRoutes,
    },
    {
        path: '/api',
        handler: apiRoutes,
    },
    {
        path: '/',
        handler: (req, res) => {
            res.json({ message: 'Server Started' });
        },
    },
];

module.exports = (app) => {
    routes.forEach((r) => {
        if (r.path == '/') {
            app.get(r.path, r.handler);
        } else {
            app.use(r.path, r.handler);
        }
    });
};
