import Discord from "discord.js";
export interface CommandData {
	interaction: Interaction;
	profile: Profile;
	updateProfile(data: any, uid?: string): Promise<Profile>;
	profileOf(userID: string): Promise<Profile>;
}
export interface Interaction extends Discord.Interaction {
	readonly command:
		| Discord.ApplicationCommand
		| Discord.ApplicationCommand<{ guild: Discord.GuildResolvable }>
		| null;
	readonly channel: Discord.TextBasedChannels;
	channelId: Discord.Snowflake;
	commandId: Discord.Snowflake;
	commandName: string;
	deferred: boolean;
	ephemeral: boolean;
	options: Discord.CommandInteractionOptionResolver;
	replied: boolean;
	webhook: Discord.InteractionWebhook;
	deferReply(
		options: Discord.InteractionDeferReplyOptions & { fetchReply: true }
	): Promise<Discord.Message>;
	deferReply(options?: Discord.InteractionDeferReplyOptions): Promise<void>;
	deleteReply(): Promise<void>;
	editReply(
		options: string | Discord.MessagePayload | Discord.WebhookEditMessageOptions
	): Promise<Discord.Message>;
	fetchReply(): Promise<Discord.Message>;
	followUp(
		options: string | Discord.MessagePayload | Discord.InteractionReplyOptions
	): Promise<Discord.Message>;
	reply(
		options: Discord.InteractionReplyOptions & { fetchReply: true }
	): Promise<Discord.Message>;
	reply(
		options: string | Discord.MessagePayload | Discord.InteractionReplyOptions
	): Promise<void>;
	member: Discord.GuildMember;
	user: Discord.User;
}
export interface Profile {
	userID: string;
	mincoDollars?: number;
	bank?: number;
	birthday?: string;
	favs?: {
		food?: string;
		color?: string;
		animal?: string;
	};
	spouse?: string;
	inventory?: string[];
	gems?: string[];
	candyAmount?: number;
	zoo?: zooSchema[];
	penguin?: string;
	market?: marketSchema[];
	lastUsedDaily?: number;
}

interface zooSchema {
	name: string;
	emoji: string;
}

interface marketSchema {
	price: number;
	name: string;
	desc?: string;
}
