import filter from 'leo-profanity';
filter.add([
	'fucked',
	'fuced',
	'fuc',
	'fuq',
	'stfu',
	'feck',
	'fawk',
	'shet',
	'betch',
	'cocaine',
	'heroin',
	'retard',
	'retarded'
]);
filter.remove(['suck', 'sucks', 'butt']);

export default (content: string) => {
	const newContent = content
		.replaceAll(/[!@#$%^&*()-+/.,;'~`=_><?{}]/g, '')
		.replaceAll('\n', ' ');
	if (filter.check(newContent)) return true;
	if (newContent.includes('middle_finger')) return true;
	return false;
};
