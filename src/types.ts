import Discord from "discord.js";
export interface CommandData {
	interaction: Interaction;
	profile: Profile;
	updateProfile(data: any, uid?: string): Promise<Profile>;
	updateServer(data: any, sid?: string): Promise<ServerData>;
	profileOf(userID: string): Promise<Profile>;
	server: ServerData;
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
export interface ServerData {
	serverID: string;
	prefixes?: string[];
	bannedPeople?: string[];
	blacklist?: string[];
	welcomeChannel?: string;
	welcomeMessage: string;
	leaveMessage: string[];
	welcomeDM?: string;
	memberCount?: number;
	silenceJoins: boolean;
	silenceBans: boolean;
	muteRole?: string;
	mainRole?: string;
	modRole?: string;
	botRole?: string;
	sendBirthdays: boolean;
	birthdays?: Map<string, string>;
	birthdayChannel?: string;
	starboard?: { channelID?: string; starAmount?: number };
	clean: boolean;
	timezone: any;
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
