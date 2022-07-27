export default function chunkArray<T>(
	myArray: T[],
	chunkSize: number
): T[][] {
	const tempArray = [];

	for (let index = 0; index < myArray.length; index += chunkSize) {
		const myChunk = myArray.slice(index, index + chunkSize);
		// do something if you want with the group
		tempArray.push(myChunk);
	}

	return tempArray;
}
