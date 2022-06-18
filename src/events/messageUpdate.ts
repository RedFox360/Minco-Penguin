import { Client, Message } from 'discord.js';

export default (client: Client) =>
	client.on('messageUpdate', (_, newMessage) => {
		if (newMessage instanceof Message)
			client.emit('messageCreate', newMessage);
	});
