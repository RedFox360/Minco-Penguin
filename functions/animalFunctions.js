const animals = require("./animals.json");
module.exports = {
	animalExists(animal) {
		for (let { name } of animals) {
			if (name.toLowerCase() == animal.toLowerCase()) return true;
		}
		return false;
	},
	getAnimal(animal) {
		for (let a of animals) {
			if (animal.toLowerCase() == a.name.toLowerCase()) return a;
		}
		return null;
	},
	hasAnimal(animal, profileData) {
		for (let { name } of profileData.zoo) {
			if (animal.toLowerCase() == name.toLowerCase()) return true;
		}
		return false;
	},
};
