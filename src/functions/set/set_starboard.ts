import { CommandData } from "../../types";
import { SlashCommandSubcommandBuilder } from "@discordjs/builders";

export function subcommand() {
	return new SlashCommandSubcommandBuilder()
		.setName("starboard")
		.setDescription("Set a starboard for your server")
		.addChannelOption((option) =>
			option
				.setName("channel")
				.setDescription("The starboard channel")
				.setRequired(true)
		)
		.addIntegerOption((option) =>
			option
				.setName("amount")
				.setDescription("The amount of star reactions to get a message posted")
				.setRequired(true)
		);
}

export async function run({ interaction, updateServer }: CommandData) {
	if (!interaction.guild) {
		await interaction.reply({
			content: "This command can only be used in a server",
			ephemeral: true,
		});
		return;
	}
	if (!interaction.member.permissions.has("MANAGE_GUILD")) {
		await interaction.reply({
			content:
				"You need the `Manage Server` permission to execute this command",
			ephemeral: true,
		});
		return;
	}

	const channel = interaction.options.getChannel("channel");
	if (!channel.isText()) {
		await interaction.reply({
			content: "That channel is invalid",
			ephemeral: true,
		});
		return;
	}
	const { id } = channel;
	const starAmount = interaction.options.getInteger("amount");
	if (starAmount <= 0 || starAmount > 20) {
		await interaction.reply({
			content: "The star amount must be above 0 and less than 21",
			ephemeral: true,
		});
	}
	await updateServer({ starboard: { channelID: id, starAmount } });
}
