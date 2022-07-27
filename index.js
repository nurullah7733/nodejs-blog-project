const app = require('./app');

app.listen(process.env.PORT || 4000, (err, success) => {
    if (err) {
        console.log('App Running faild');
    } else {
        console.log('App Running at ', process.env.PORT);
    }
});
