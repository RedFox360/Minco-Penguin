const polka = require("polka");
const app = polka();

app.get("/", (req, res) => {
	res.send("Minco Penguin Host server");
});

module.exports = () => {
	let port = process.env.PORT || 5000;
	app.listen(port);
};
