import { SlashCommandBuilder } from "@discordjs/builders";
import slashHandler from "../../handlers/slash_handler";
export const data = new SlashCommandBuilder()
	.setName("handle_slash")
	.setDescription("Handle slashes");

export async function run({ interaction }) {
	if (interaction.author.id === "724786310711214118") {
		slashHandler(interaction.client, true);
	}
}
