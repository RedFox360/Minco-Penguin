const profileModel = require("../../models/profileSchema");
module.exports = {
	description: "Create or remove an account to store Minco Dollars!",
	usage: "!account create/remove <account name>",
	async execute(message, args, _0, _1, profileData) {
		const accounts = profileData.acounts || [];
		if (!profileData.accounts) {
			profileModel.findOneAndUpdate(
				{ userID: message.author.id },
				{
					accounts,
				}
			);
		}
		if (args.length < 1) return "Valid usage: !account create/remove <account name>";
		const accountName = args[1];

		const accountMentioned = accounts.find((account) => account.name === accountName);
		if (args[0] == "create") {
			if (accountMentioned) {
				return "This account already exists!";
			}

			await profileModel.findOneAndUpdate(
				{
					userID: message.author.id,
				},
				{
					$push: {
						accounts: {
							name: accountName,
							mincoDollars: 0,
							orbs: 0,
						},
					},
				}
			);
			message.channel.send(`You created the account ${accountName}!`);
		} else if (args[0] == "remove") {
			if (!accountMentioned) {
				return "This account doesn't exist! (remember capitalization)";
			}

			await profileModel.findOneAndUpdate(
				{
					userID: message.author.id,
				},
				{
					$push: {
						accounts: {
							name: accountName,
						},
					},
					$inc: {
						mincoDollars: accountMentioned.mincoDollars,
						orbs: accountMentioned.orbs,
					},
				}
			);
			message.channel.send(
				`You removed the account ${accountName}. (all your money has been transferred into your main account)`
			);
		} else return "Valid usage: !account create/remove <account name>";
	},
};
