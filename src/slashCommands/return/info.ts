import { CommandData } from "../../types";
import { SlashCommandBuilder } from "@discordjs/builders";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import memberInfo from "../../functions/member_info";
import serverInfo from "../../functions/server_info";
dayjs.extend(utc);
dayjs.extend(timezone);

export const data = new SlashCommandBuilder()
	.setName("info")
	.setDescription("Get the info of a user")
	.addSubcommand((subcommand) =>
		subcommand
			.setName("member")
			.setDescription("View the info of a member in the server")
			.addUserOption((option) =>
				option
					.setName("user")
					.setDescription("The user to get info from")
					.setRequired(true)
			)
	)
	.addSubcommand((subcommand) =>
		subcommand.setName("server").setDescription("View the info of this server")
	);

export async function run(data: CommandData) {
	switch (data.interaction.options.getSubcommand()) {
		case "member": {
			memberInfo(data);
			break;
		}
		case "server": {
			serverInfo(data);
			break;
		}
	}
}
