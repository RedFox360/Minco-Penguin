module.exports = {
    name: 'ubuntu',
    description: 'Get the ubuntu name of someone',
    execute(_, args) {
        switch (args[1].toLowerCase()) {
            case 'sammy': return 'Kirabo the Wizard';
            case 'shriya': return 'Queen Adelaide';
            case 'ishan': return 'King Asgard';
            case 'neil': return 'Mokuku (also Ishan)';
            case 'annie': return 'General Jamilla'
        }
    }
}
