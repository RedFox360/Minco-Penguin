import express from "express";
const app = express();

app.get("/", (req, res) => {
	res.send("Minco Penguin Host Server");
});

export default function run() {
	let port = process.env.PORT || 5000;
	app.listen(port);
}
