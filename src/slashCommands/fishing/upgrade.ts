import { CommandData } from "../../types";
import { SlashCommandBuilder } from "@discordjs/builders";
import {
	MessageEmbed,
	MessageActionRow,
	MessageButton,
	MessageComponentInteraction,
} from "discord.js";
export const data = new SlashCommandBuilder()
	.setName("upgrade")
	.setDescription("Upgrade your fishing rod to the next tier");

export async function run({
	interaction,
	profile,
	updateProfile,
}: CommandData) {
	const {
		fish: { xp },
		rod,
		mincoDollars,
	} = profile;
	if (rod === "emerald") {
		await interaction.reply(
			"You already have the highest tier rod (emerald)! You can't upgrade it anymore"
		);
		return;
	}
	const { xpNeeded, rodToUpgrade, price, benefits } = getRodInfo(rod);

	if (xp < xpNeeded) {
		await interaction.reply({
			content: `You need ${xpNeeded} fish XP to upgrade to the **${rodToUpgrade}** rod. You currently have ${xp} xp.`,
			ephemeral: true,
		});
		return;
	}
	const priceFormat = price.toLocaleString();
	if (mincoDollars < price) {
		await interaction.reply({
			content: `The **${rodToUpgrade}** rod costs ${priceFormat} MD. You currently have ${mincoDollars} MD in your wallet.`,
			ephemeral: true,
		});
		return;
	}
	const messageInfo = checkGems(rodToUpgrade, profile);
	if (messageInfo) {
		await interaction.reply({ content: messageInfo, ephemeral: true });
		return;
	}
	const userId = interaction.user.id;
	const upgradeButton = new MessageButton()
		.setCustomId("upgrade")
		.setLabel("Upgrade")
		.setStyle("SUCCESS");
	const filter = (i) => i.user.id === userId && i.customId === "upgrade";
	const row = new MessageActionRow().addComponents(upgradeButton);
	const upgradeEmbed = new MessageEmbed()
		.setAuthor(
			interaction.member.displayName,
			interaction.member.displayAvatarURL()
		)
		.setTitle("Upgrade rod")
		.setDescription(
			`Price: **${priceFormat} MD**
Click the "Upgrade" button to upgrade your ${rod} rod to a(n) **${rodToUpgrade}** rod
This button will not work after 10 minutes
Benefits: \`${benefits}\``
		)
		.setColor("#D5f5E3")
		.setFooter(`${interaction.guild.name} | Current xp: ${xp}`)
		.setTimestamp();

	const msg = await interaction.reply({
		embeds: [upgradeEmbed],
		components: [row],
		fetchReply: true,
	});
	const collector = msg.createMessageComponentCollector({
		filter,
		max: 1,
		time: 600_000, //10 minutes
	});
	collector.on("collect", async (i: MessageComponentInteraction) => {
		await updateProfile({
			$inc: { mincoDollars: -price },
			rod: rodToUpgrade,
		});
		await i.reply(
			`You upgraded to a **${rodToUpgrade}** rod for ${priceFormat} Minco Dollars!`
		);
	});
}

function getRodInfo(rod: string) {
	switch (rod) {
		case "wooden": {
			return {
				xpNeeded: 500,
				rodToUpgrade: "upgraded",
				price: 300,
				benefits: "Higher chance of catching fish",
			};
		}
		case "upgraded": {
			return {
				xpNeeded: 1000,
				rodToUpgrade: "metal",
				price: 400,
				benefits: "Catch more fish but with a lower chance",
			};
		}
		case "metal": {
			return {
				xpNeeded: 1500,
				rodToUpgrade: "heavy",
				price: 500,
				benefits: "Catch more fish on average",
			};
		}
		case "heavy": {
			return {
				xpNeeded: 2000,
				rodToUpgrade: "polished",
				price: 600,
				benefits: "Higher chance of catching fish",
			};
		}
		case "polished": {
			return {
				xpNeeded: 3000,
				rodToUpgrade: "quartz",
				price: 700,
				benefits: "Higher chance of catching fish",
			};
		}
		case "quartz": {
			return {
				xpNeeded: 4000,
				rodToUpgrade: "ruby",
				price: 800,
				benefits: "Higher chance of catching fish",
			};
		}
		case "ruby": {
			return {
				xpNeeded: 5000,
				rodToUpgrade: "sapphire",
				price: 900,
				benefits: "Catch more fish on average",
			};
		}
		case "sapphire": {
			return {
				xpNeeded: 6000,
				rodToUpgrade: "diamond",
				price: 1000,
				benefits: "Catch more fish on average",
			};
		}
		case "diamond": {
			return {
				xpNeeded: 7000,
				rodToUpgrade: "emerald",
				price: 1200,
				benefits: "Catch more fish on average with a higher chance",
			};
		}
		default: {
			return {
				xpNeeded: 0,
				rodToUpgrade: "wooden",
				price: 100,
				benefits: "A standard fishing rod",
			};
		}
	}
}

function checkGems(rodToUpgrade: string, profile) {
	if (rodToUpgrade == "quartz" && !profile.gems?.includes("12")) {
		return "You need to buy the **<:quartz:844740992473104384> Quartz** gem to upgrade to the quartz rod";
	}
	if (rodToUpgrade == "ruby" && !profile.gems?.includes("06")) {
		return "You need to buy the **<:quartz:844740992473104384> Quartz** gem to upgrade to the quartz rod";
	}
	if (rodToUpgrade == "sapphire" && !profile.gems?.includes("05")) {
		return "You need to buy the **<:ruby:843184456025112606> Ruby** gem to upgrade to the ruby rod";
	}
	if (rodToUpgrade == "diamond" && !profile.gems?.includes("01")) {
		return "You need to buy the **<:blue_diamond:843178044894216202> Blue Diamond** gem to upgrade to the diamond rod";
	}
	if (rodToUpgrade == "emerald" && !profile.gems?.includes("03")) {
		return "You need to buy the **<:emerald:843180288984219689> Emerald** gem to upgrade to the emerald rod";
	}
	return null;
}
