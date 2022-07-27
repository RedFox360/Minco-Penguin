import {
	ApplicationCommandType,
	ChatInputCommandInteraction,
	ContextMenuCommandBuilder,
	PermissionResolvable,
	SlashCommandBuilder,
	SlashCommandSubcommandBuilder
} from 'discord.js';
import {
	AutocompleteInteraction,
	UserContextMenuCommandInteraction
} from 'discord.js';
import { RodType } from 'mincomodels/profileSchema/types';

const cooldownMax = 24 * 60 * 60;
const cooldownMin = 3;

type RunFunc = (
	interaction: ChatInputCommandInteraction<'cached'>
) => unknown | Promise<unknown>;
type AutocompleteFunc = (
	interaction: AutocompleteInteraction
) => unknown | Promise<unknown>;
export class SlashCommand {
	constructor() {
		this._cooldown = 0;
		this._botPermissions = [];
	}

	private _builder: SlashCommandBuilder;
	public get builder(): SlashCommandBuilder {
		return this._builder;
	}
	setCommandData(builder: (o: SlashCommandBuilder) => any): this {
		const slashBuilder = builder(new SlashCommandBuilder());
		if (!(slashBuilder instanceof SlashCommandBuilder)) {
			throw new Error(
				`${this._builder.name} Builder provided is not an instance of SlashCommandBuilder`
			);
		}
		this._builder = slashBuilder;
		return this;
	}

	private _cooldown: number;
	public get cooldown(): number {
		return this._cooldown;
	}
	setCooldown(seconds: number): this {
		if (seconds >= cooldownMax || seconds <= cooldownMin) {
			throw new Error(
				`${this._builder.name} Cooldown must be between 3 seconds and 1 day`
			);
		}
		this._cooldown = seconds * 1000;
		return this;
	}

	private _run: RunFunc;
	public get run() {
		return this._run;
	}
	setRun(runFunction: RunFunc): this {
		this._run = runFunction;
		return this;
	}

	private _autocomplete: AutocompleteFunc;
	public get autocomplete() {
		return this._autocomplete;
	}
	setAutocomplete(autocompleteFunction: AutocompleteFunc): this {
		this._autocomplete = autocompleteFunction;
		return this;
	}

	private _botPermissions: PermissionResolvable[];
	public get botPermissions() {
		return this._botPermissions;
	}
	setBotPermissions(...permissions: PermissionResolvable[]): this {
		this._botPermissions = permissions;
		return this;
	}
}
export class UserContextMenu {
	private _builder: ContextMenuCommandBuilder;
	public get builder(): ContextMenuCommandBuilder {
		return this._builder;
	}
	setCommandData(
		builder: (o: ContextMenuCommandBuilder) => any
	): this {
		const menuBuilder = builder(
			new ContextMenuCommandBuilder().setType(
				ApplicationCommandType.User
			)
		);
		if (!(menuBuilder instanceof ContextMenuCommandBuilder)) {
			throw new Error(
				'Builder provided is not an instance of ContextMenuCommandBuilder'
			);
		}
		this._builder = menuBuilder;
		return this;
	}

	private _run: (
		interaction: UserContextMenuCommandInteraction<'cached'>
	) => Promise<unknown>;
	public get run() {
		return this._run;
	}
	setRun(
		runFunction: (
			interaction: UserContextMenuCommandInteraction<'cached'>
		) => Promise<unknown>
	): this {
		this._run = runFunction;
		return this;
	}
}

export class Subcommand {
	constructor() {
		this._cooldown = 0;
	}

	private _builder: SlashCommandSubcommandBuilder;
	public get builder(): SlashCommandSubcommandBuilder {
		return this._builder;
	}
	setCommandData(
		builder: (o: SlashCommandSubcommandBuilder) => any
	): this {
		const slashBuilder = builder(new SlashCommandSubcommandBuilder());
		if (!(slashBuilder instanceof SlashCommandSubcommandBuilder)) {
			throw new Error(
				`${this._builder.name} Builder provided is not an instance of SlashCommandBuilder`
			);
		}
		this._builder = slashBuilder;
		return this;
	}

	private _cooldown: number;
	public get cooldown(): number {
		return this._cooldown;
	}
	setCooldown(seconds: number): this {
		if (seconds >= cooldownMax || seconds <= cooldownMin) {
			throw new Error(
				`${this._builder.name} Cooldown must be between 3 seconds and 1 day`
			);
		}
		this._cooldown = seconds * 1000;
		return this;
	}

	private _run: RunFunc;
	public get run() {
		return this._run;
	}
	setRun(runFunction: RunFunc): this {
		this._run = runFunction;
		return this;
	}
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
