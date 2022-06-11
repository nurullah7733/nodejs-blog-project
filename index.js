const app = require('./app');

app.listen(4000, (err, success) => {
    if (err) {
        console.log('App Running faild');
    } else {
        console.log('App Running at ' + 4000);
    }
});
