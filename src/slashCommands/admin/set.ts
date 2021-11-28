import { CommandData } from "../../types";
import { SlashCommandBuilder } from "@discordjs/builders";
import * as setAnnounceMessage from "../../functions/set_announce_message";
import * as setBirthday from "../../functions/set_birthday";
import * as setBoolean from "../../functions/set_bool";
import * as setTimezone from "../../functions/set_timezone";
import * as setWelcomeChannel from "../../functions/set_welcome_channel";
import * as setRole from "../../functions/set_role";
import * as setStarboard from "../../functions/set_starboard";

export const data = new SlashCommandBuilder()
	.setName("set")
	.setDescription("Set values for your user/server")
	.addSubcommand(setAnnounceMessage.subcommand)
	.addSubcommand(setBirthday.subcommand)
	.addSubcommand(setBoolean.subcommand)
	.addSubcommand(setTimezone.subcommand)
	.addSubcommand(setWelcomeChannel.subcommand)
	.addSubcommand(setStarboard.subcommand)
	.addSubcommand(setRole.subcommand);

export async function run(data: CommandData) {
	switch (data.interaction.options.getSubcommand()) {
		case "announce_message": {
			await setAnnounceMessage.run(data);
			break;
		}
		case "birthday": {
			await setBirthday.run(data);
			break;
		}
		case "boolean": {
			await setBoolean.run(data);
			break;
		}
		case "timezone": {
			await setTimezone.run(data);
			break;
		}
		case "welcome_channel": {
			await setWelcomeChannel.run(data);
			break;
		}
		case "starboard": {
			await setStarboard.run(data);
			break;
		}
		case "role": {
			await setRole.run(data);
			break;
		}
	}
}
