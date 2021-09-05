import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed } from "discord.js";
import { CommandData } from "../../types";

export const data = new SlashCommandBuilder()
	.setName("gems")
	.setDescription("View your gems!")
	.addUserOption((option) =>
		option
			.setName("user")
			.setDescription("The user to view the gems of")
			.setRequired(false)
	);

export async function run({ interaction, profileOf }: CommandData) {
	const userExists = interaction.options.getUser("user");
	const user = userExists ?? interaction.user;

	const profile = await profileOf(user.id);
	if (!profile.gems.length) {
		await interaction.reply({
			content: `${
				userExists ? `${userExists} doesn't` : "You don't"
			} have any gems`,
			ephemeral: true,
		});
		return;
	}

	const gems = profile.gems
		.map((t) => {
			if (t == "01") return "<:blue_diamond:843178044894216202> Blue Diamond";
			if (t == "02") return "<:pink_diamond:843177780946010132> Pink Diamond";
			if (t == "03") return "<:emerald:843180288984219689> Emerald";
			if (t == "04") return "<:gold_bar:843180638705287188> Gold Bar";
			if (t == "05") return "<:sapphire:843182746050232340> Sapphire";
			if (t == "06") return "<:ruby:843184456025112606> Ruby";
			if (t == "07") return "<:amethyst:843184890337296454> Amethyst";
			if (t == "08")
				return "<:black_diamond:843607902136696862> **Black Diamond**";
			if (t == "09") return "<:topaz:844645993747185686> Topaz";
			if (t == "10") return "<:moonstone:844646676337131521> Moonstone";
			if (t == "11") return "<:opal:844663271705280533> Opal";
			if (t == "12") return "<:quartz:844740992473104384> Quartz";
			if (t == "13") return "<:alexandrite:845793544278638603> Alexandrite";
			if (t == "14") return "<:jade:845834920903704587> Jade";
			if (t == "15") return "<:lapis_lazuli:884171323004297226> Lapis Lazuli";
			if (t == "16") return "<:rose_quartz:884172100062052422> Rose Quartz";
			if (t == "157")
				return "<:green_diamond:844236649948905483> **Green Diamond**";
			if (t == "158") return "<:ametrine:844649341481910323> **Ametrine**";
			if (t == "159") return "<:fluorite:884170534391275540> **Fluorite**";
		})
		.map((t, i) => `${i + 1}. ${t}`);

	const gemEmbed = new MessageEmbed()
		.setAuthor("Gems", user.avatarURL())
		.setDescription(gems.join("\n"))
		.setColor("#F8C471")
		.setFooter(interaction.guild?.name ?? interaction.user.username);

	await interaction.reply({ embeds: [gemEmbed] });
}
