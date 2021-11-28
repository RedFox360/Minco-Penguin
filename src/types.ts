import Discord, { GuildChannel } from "discord.js";
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
export interface Interaction extends Discord.CommandInteraction {
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
	options: Options;
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
interface Options extends Discord.CommandInteractionOptionResolver {
	getChannel(name: string, required: true): NonNullable<GuildChannel>;
	getChannel(
		name: string,
		required?: boolean
	): NonNullable<GuildChannel> | null;
}

export interface ProfileInServer {
	userID: string;
	serverID: string;
	market?: marketSchema[];
	isShadowBanned: boolean;
	bannedFromCommands: boolean;
	bannedFromConfessions: boolean;
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
	fish?: Fishes;
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
interface Fishes {
	cods: number;
	salmons: number;
	pufferfish: number;
	clownfish: number;
	axolotls: number;
}
interface marketSchema {
	price: number;
	name: string;
	desc?: string;
}
type RodType =
	| "wood"
	| "upgraded"
	| "metal"
	| "heavy"
	| "polished"
	| "quartz"
	| "ruby"
	| "sapphire"
	| "diamond"
	| "emerald";
