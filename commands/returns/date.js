const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");
dayjs.extend(utc);
dayjs.extend(timezone);

module.exports = {
	description: "Returns the date using dayjs (valid timezones: PT, MT, CT, ET, UTC, BST, CET)",
	usage: "!date (timezone) (dayjs/momentjs format)",
	execute(message, args) {
		if (!args.length) return `Valid usage: ${this.usage}`;
		const first = args[0];
		let timezone = stringToTime(first);
		if (timezone === null) return "Enter a valid timezone";

		const date = dayjs.tz(Date.now(), timezone);
		args.shift();
		const format = args.join(" ") || `ddd [**]MMM D, YYYY[**] HH:mm [${first}]`;
		message.channel.send(date.format(format));
	},
};

function stringToTime(str) {
	switch (str) {
		case "PT":
			return "America/Los_Angeles";
		case "MT":
			return "America/Denver";
		case "CT":
			return "America/Chicago";
		case "ET":
			return "America/New_York";
		case "UTC":
			return "Etc/UTC";
		case "BST":
			return "Europe/London";
		case "CET":
			return "Europe/Berlin";
		default:
			return null;
	}
}
