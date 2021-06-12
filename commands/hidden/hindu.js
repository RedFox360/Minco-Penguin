module.exports = {
	description: "Returns a random Hindu holiday",
	usage: "!hindu holiday(s) (all)",
	execute(_, args) {
		if (args[0].startsWith("holiday")) {
			const holidays = [
				":sun_with_face: Makar sankranti: January\nHoliday for the Sun God Surya",
				":blue_book: Vasant Panchami: February\nHoliday for the goddess of wisdom Sarasvati",
				":orange_circle: Holi: March\nThe holiday of colors",
				"Rama Navami: April\nBirth of Rama",
				"Hanuman Jayanti: April\nBirth of Hanuman",
				":heart: Rakhi: August\nHoliday for brothers and sisters",
				"Krishna Janmashtami: August\nHoliday for the avatar of Vishnu Krishna",
				":fallen_leaf: Navaratri: October\nA nine-day holiday in the autumn",
				":diya_lamp: Divali: October/November\nA holiday that represents the victory of good over evil. AKA The Festival of Lights",
			];

			if (args[1] == "all") return holidays.join("\n\n");
			return holidays.rand();
		}
	},
};
