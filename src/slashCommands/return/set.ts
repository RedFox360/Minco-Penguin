import { CommandData } from "../../types";
import { SlashCommandBuilder } from "@discordjs/builders";
import setAnnounceMessage from "../../functions/set_announce_message";
import setBirthday from "../../functions/set_birthday";
import setBoolean from "../../functions/set_bool";
import setTimezone from "../../functions/set_timezone";
import setWelcomeChannel from "../../functions/set_welcome_channel";

export const data = new SlashCommandBuilder()
	.setName("set")
	.setDescription("Set values for your user/server")
	.addSubcommand((subcommand) =>
		subcommand
			.setName("announce_message")
			.setDescription(
				"Set the announcement message for your server (type default to revert to normal)"
			)
			.addStringOption((option) =>
				option
					.setName("message_type")
					.setDescription("The type of message")
					.setRequired(true)
					.addChoice("User joined", "join")
					.addChoice("User left", "leave")
					.addChoice("DM on join", "dm")
			)
			.addStringOption((option) =>
				option
					.setName("message")
					.setDescription("The message you want to send")
					.setRequired(true)
			)
	)
	.addSubcommand((subcommand) =>
		subcommand
			.setName("birthday")
			.setDescription("Set your birthday")
			.addStringOption((option) =>
				option
					.setName("birthday")
					.setDescription("Your birthday in the format (YYYY)-MM-DD")
					.setRequired(true)
			)
			.addUserOption((option) =>
				option
					.setName("user")
					.setDescription("Owner only: set the birthday of a specific user")
					.setRequired(false)
			)
	)
	.addSubcommand((subcommand) =>
		subcommand
			.setName("boolean")
			.setDescription("Sets a boolean (true/false) value for your server")
			.addStringOption((option) =>
				option
					.setName("option")
					.setDescription("The name of the option to set")
					.addChoice("Send Birthdays", "sb")
					.addChoice("Profanity", "p")
					.addChoice("Silence Ban Messages", "sbm")
					.addChoice("Silence Join Messages", "sjm")
					.setRequired(true)
			)
			.addBooleanOption((option) =>
				option
					.setName("value")
					.setDescription("The true/false value of the option")
					.setRequired(true)
			)
	)
	.addSubcommand((subcommand) =>
		subcommand
			.setName("timezone")
			.setDescription("Set a timezone for your server/user")
			.addStringOption((option) =>
				option
					.setName("type")
					.setDescription("Personal or server timezone")
					.setRequired(true)
					.addChoice("Personal", "personal")
					.addChoice("Server", "server")
			)
			.addStringOption((option) =>
				option
					.setName("timezone")
					.setDescription("The timezone of your server")
					.setRequired(true)
			)
	)
	.addSubcommand((subcommand) =>
		subcommand
			.setName("welcome_channel")
			.setDescription("Set the welcome channel of your server")
			.addChannelOption((option) =>
				option
					.setName("channel")
					.setDescription("The channel")
					.setRequired(true)
			)
	);

export async function run(data: CommandData) {
	switch (data.interaction.options.getSubcommand()) {
		case "announce_message": {
			await setAnnounceMessage(data);
			break;
		}
		case "birthday": {
			await setBirthday(data);
			break;
		}
		case "boolean": {
			await setBoolean(data);
			break;
		}
		case "timezone": {
			await setTimezone(data);
			break;
		}
		case "welcome_channel": {
			await setWelcomeChannel(data);
			break;
		}
	}
}
