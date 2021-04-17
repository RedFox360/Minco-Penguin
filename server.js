import express from "express";
var app = express();
app.get("/", function (req, res) {
    res.send("Minco Penguin Host Server");
});
export default function run() {
    var port = process.env.PORT || 5000;
    app.listen(port);
}
