const app = require('express')();

app.get('/', (req, res) => {
    res.send('Minco Penguin Host Server');
})

module.exports = () => {
    let port = process.env.PORT || 5000;
    app.listen(port);
}