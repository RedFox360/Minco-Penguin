async function calculatePower(userID) {
	let attack = 0;
	let defense = 0;
	let health = 100;
	const profile, { inventory } = await profileModel.findOne({ userID });

	if (inventory.includes("06")) attack += 12;

	if (inventory.includes("08")) defense += 8;

	if (inventory.includes("07")) health += 8;

    if (inventory.includes("09")) {
        attack += 6;
        health -= 3;
    }

    if (profile.spouse != null) health += 8;
		
    await profileModel.findOneAndUpdate(
			{
				userID,
			},
			{
				battle: {
					attack,
					defense,
					health,
				},
			}
		);

	return [attack, defense, health];
}

module.exports = calculatePower;
