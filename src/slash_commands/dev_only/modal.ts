import {
	MessageActionRow,
	Modal,
	ModalActionRowComponent,
	TextInputComponent
} from 'discord.js';
import { SlashCommand } from '../../types';

const modal = new SlashCommand()
	.setCommandData(builder =>
		builder.setName('modal').setDescription('Modal testing')
	)
	.setRun(async interaction => {
		const nameInput = new TextInputComponent()
			.setCustomId('textInput')
			.setLabel("What's your name?")
			.setStyle('SHORT');

		const actionRow =
			new MessageActionRow<ModalActionRowComponent>().addComponents(
				nameInput
			);

		const modal = new Modal()
			.setCustomId('myModal')
			.setTitle('User Info')
			.addComponents(actionRow);

		await interaction.showModal(modal);
	});

export default modal;
