const arr = new Array<number>(1000);
let xpAmountForLevel = 100;
for (let i = 0; i < arr.length; i++) {
	arr[i] = xpAmountForLevel;
	const toAdd = i * 100 + 50;
	xpAmountForLevel += toAdd;
}

export function xpAmountToLevel(xp: number) {
	return arr.findIndex(amount => amount > xp);
}

export { arr as levelXpArr };
