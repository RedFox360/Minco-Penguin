import Discord from "discord.js";
export interface CommandData {
	interaction: Interaction;
	profile: Profile;
	profileInServer: ProfileInServer;
	server: ServerData;
	updateProfile(data: any, uid?: string): Promise<Profile>;
	updateServer(data: any, sid?: string): Promise<ServerData>;
	updateProfileInServer(
		data: any,
		uid?: string,
		sid?: string
	): Promise<ProfileInServer>;
	profileOf(userID: string): Promise<Profile>;
	profileInServerOf(
		userID: string,
		serverID?: string
	): Promise<ProfileInServer>;
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
export interface ProfileInServer {
	userID: string;
	serverID: string;
	market?: marketSchema[];
	isShadowBanned: boolean;
}
export interface ServerData {
	serverID: string;
	prefixes?: string[];
	bannedPeople?: string[];
	blacklist?: string[];
	welcomeChannel?: string;
	welcomeMessage: string;
	leaveMessage: string;
	welcomeDM?: string;
	memberCount?: number;
	silenceJoins: boolean;
	silenceBans: boolean;
	muteRole?: string;
	mainRole?: string;
	modRole?: string;
	botRole?: string;
	joinRole?: string;
	sendBirthdays: boolean;
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
	rod: RodType;
	fish?: FishType[];
	zoo?: zooSchema[];
	penguin?: string;
	lastUsedDaily?: number;
	baits: {
		worms: number;
		leeches: number;
		bugs: number;
		fishes: number;
	};
	lastUsedWeekly: number;
	timezone: string;
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
type FishType = 1 | 2 | 3 | 4 | 5;
type RodType =
	| "normal"
	| "metal"
	| "heavy"
	| "lava"
	| "ruby"
	| "diamond"
	| "emerald"
	| "legendary gemstone";
