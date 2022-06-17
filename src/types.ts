import {
  ContextMenuCommandBuilder,
  SlashCommandBuilder
} from '@discordjs/builders';
import {
  CommandInteraction,
  PermissionResolvable,
  UserContextMenuInteraction
} from 'discord.js';

const cooldownMax = 24 * 60 * 60;
const cooldownMin = 3;
export class SlashCommand {
  public builder: SlashCommandBuilder;
  public permissions: PermissionResolvable[];
  public permissionsRequiredForBot: boolean;
  public cooldown: number;
  run: (interaction: CommandInteraction<'cached'>) => Promise<any>;
  constructor() {
    this.permissions = [];
    this.permissionsRequiredForBot = true;
    this.cooldown = 0;
  }
  setCommandData(builder: (o: SlashCommandBuilder) => any): this {
    const slashBuilder = builder(new SlashCommandBuilder());
    if (!(slashBuilder instanceof SlashCommandBuilder)) {
      throw new Error(
        `${this.builder.name} Builder provided is not an instance of SlashCommandBuilder`
      );
    }
    this.builder = slashBuilder;
    return this;
  }
  setRun(
    runFunction: (
      interaction: CommandInteraction<'cached'>
    ) => Promise<any>
  ): this {
    this.run = runFunction;
    return this;
  }
  setPermissions(...permissions: PermissionResolvable[]): this {
    this.permissions = permissions;
    return this;
  }
  setPermissionsRequiredForBot(botNeedsPermissions: boolean): this {
    this.permissionsRequiredForBot = botNeedsPermissions;
    return this;
  }
  setCooldown(seconds: number): this {
    if (seconds >= cooldownMax || seconds <= cooldownMin) {
      throw new Error(
        `${this.builder.name} Cooldown must be between 3 seconds and 1 day`
      );
    }
    this.cooldown = seconds * 1000;
    return this;
  }
}
export class UserContextMenu {
  public builder: ContextMenuCommandBuilder;
  run: (
    interaction: UserContextMenuInteraction<'cached'>
  ) => Promise<any>;
  setCommandData(
    builder: (o: ContextMenuCommandBuilder) => any
  ): this {
    const menuBuilder = builder(
      new ContextMenuCommandBuilder().setType(2)
    );
    if (!(menuBuilder instanceof ContextMenuCommandBuilder)) {
      throw new Error(
        'Builder provided is not an instance of ContextMenuCommandBuilder'
      );
    }
    this.builder = menuBuilder;
    return this;
  }
  setRun(
    runFunction: (
      interaction: UserContextMenuInteraction<'cached'>
    ) => Promise<any>
  ): this {
    this.run = runFunction;
    return this;
  }
}
type AllReadOnly<T> = {
  readonly [key in keyof T]: T[key];
};
export type ProfileInServer = AllReadOnly<{
  userID: string;
  serverID: string;
  market?: MarketItem[];
  isShadowBanned: boolean;
  bannedFromCommands: boolean;
  bannedFromConfessions: boolean;
  logs?: Log[];
}>;
export type ServerData = AllReadOnly<{
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
  autowarns?: AutoWarn[];
  profanityPunishment?: {
    punishment: 'warn' | 'timeout' | 'ban' | 'kick';
    time?: number;
  };
  muteRole?: string;
  mainRole?: string;
  modRole?: string;
  botRole?: string;
  joinRole?: string;
  messageLogChannelId?: string;
  mainLogChannelId?: string;
  sendBirthdays: boolean;
  birthdayChannel?: string;
  currentCaseNo: number;
  clean: boolean;
  timezone: any;
  starboard?: {
    channelID?: string;
    starAmount: number;
    messages?: Map<string, string>;
  };
}>;

export const ApplicationCommandPermissionTypes = <const>{
  ROLE: 1,
  USER: 2
};

export type Profile = AllReadOnly<{
  userID: string;
  mincoDollars: number;
  bank: number;
  birthday?: string;
  spouse?: string;
  inventory?: string[];
  gems?: string[];
  candyAmount?: number;
  zoo?: zooSchema[];
  lastUsedDaily?: number;
  lastUsedWeekly?: number;
  timezone: string;
  favs?: {
    food?: string;
    color?: string;
    animal?: string;
  };
  fish?: {
    // --- NEW VERSION ---
    rod?: RodType;
    fishInventory: Map<string, number>;
    biome: Biome;
    xp: number;
  };
}>;

interface zooSchema {
  name: string;
  emoji: string;
}

export interface Log {
  type: LogType;
  case: number;
  time?: number;
  date: Date;
  reason?: string;
  moderator: string;
}
interface MarketItem {
  price: number;
  name: string;
  desc?: string;
}
export interface AutoWarn {
  warnAmount: number;
  divisible: boolean;
  punishment: AutoWarnPunishment;
  time?: number; // for timeout only
}
export interface FishJSON {
  [fish: string]: {
    formattedNames: string[];
    minPrice: number;
    maxPrice: number;
    defaultChance: number;
    maxAmount: number;
    rarity: number;
    biomes: string[];
  };
}
interface RodJSONElement {
  name: RodType;
  benefits: string;
  price: number;
  xp: number;
  rodToUpgrade: RodType;
  rarityChanceIncrease: number;
  maxAmountIncrease: number;
  gem?: string;
}
export type RodJSON = RodJSONElement[];

export type AutoWarnPunishment = 'timeout' | 'kick' | 'ban';
export type Biome =
  | 'ocean'
  | 'river'
  | 'warm ocean'
  | 'lush cave'
  | 'pond'
  | 'beach';

export type RodType =
  | 'wooden'
  | 'bone'
  | 'candle'
  | 'copper'
  | 'steel'
  | 'heavy'
  | 'polished'
  | 'quartz'
  | 'amethyst'
  | 'blazing'
  | 'dark'
  | 'ruby'
  | 'marble'
  | 'sapphire'
  | 'gold'
  | 'eternal'
  | 'opal'
  | 'moonstone'
  | 'shining'
  | 'topaz'
  | 'silver'
  | 'jade'
  | 'floral'
  | 'diamond'
  | 'emerald'
  | 'prismarine'
  | 'pink diamond'
  | 'titanium'
  | 'black diamond'
  | 'obsidian';

export type LogType =
  | 'Warn'
  | 'Timeout'
  | 'End Timeout'
  | 'Kick'
  | 'Ban';
