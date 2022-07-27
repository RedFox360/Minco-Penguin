import { Profile } from 'mincomodels/profileSchema/types';
import penguinData from '../../json/penguins_battle.json';

interface Stats {
	attack: number;
	attackSpeed: number;
	health: number;
	defense: number;
	regen: number;
	crit: number; // eg 75 = 75% chance
	color: number;
}

export default function calculateStats(profile: Profile): Stats {
	if (!profile.battleSystem?.penguin) return null;
	const { battleSystem } = profile;
	switch (battleSystem.penguin) {
		case 'warrior': {
			return {
				attack: 30,
				attackSpeed: 1.5,
				health: 100,
				defense: 30,
				regen: 10,
				crit: 25,
				color: penguinData.warriorColor
			};
		}
		case 'magician': {
			return {
				attack: 25,
				attackSpeed: 1.5,
				health: 85,
				defense: 50,
				regen: 15,
				crit: 30,
				color: penguinData.magicianColor
			};
		}
		case 'medic': {
			return {
				attack: 20,
				attackSpeed: 1,
				health: 150,
				defense: 30,
				regen: 20,
				crit: 20,
				color: penguinData.medicColor
			};
		}
		case 'ninja': {
			return {
				attack: 70,
				attackSpeed: 1,
				health: 85,
				defense: 50,
				regen: 5,
				crit: 90,
				color: penguinData.ninjaColor
			};
		}
		case 'archer': {
			return {
				attack: 25,
				attackSpeed: 2,
				health: 85,
				defense: 25,
				regen: 10,
				crit: 50,
				color: penguinData.archerColor
			};
		}
	}
}
