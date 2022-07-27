import { Snowflake } from 'discord.js';
import type { LogType } from 'mincomodels/profileInServerSchema/types';
import { updateProfileInServer, updateServer } from '../models';

export async function logTimeout(
	userId: Snowflake,
	guildId: Snowflake,
	time: number,
	reason?: string,
	moderatorId?: Snowflake
) {
	const logTime = new Date();
	const { currentCaseNo } = await updateServer(
		{
			$inc: { currentCaseNo: 1 }
		},
		guildId
	);
	const { logs } = await updateProfileInServer(
		{
			$push: {
				logs: {
					type: 'Timeout',
					case: currentCaseNo,
					time,
					date: logTime,
					reason,
					moderator: moderatorId
				}
			}
		},
		userId,
		guildId
	);
	return { currentCaseNo, logTime, logs };
}

async function baseLog(
	userId: Snowflake,
	guildId: Snowflake,
	moderatorId: Snowflake,
	reason: string,
	type: LogType
) {
	const logTime = new Date();
	const { currentCaseNo } = await updateServer(
		{
			$inc: { currentCaseNo: 1 }
		},
		guildId
	);
	const { logs } = await updateProfileInServer(
		{
			$push: {
				logs: {
					type,
					case: currentCaseNo,
					date: logTime,
					reason,
					moderator: moderatorId
				}
			}
		},
		userId,
		guildId
	);
	return { logTime, currentCaseNo, logs };
}

export function logBan(
	userId: Snowflake,
	guildId: Snowflake,
	reason?: string,
	moderatorId?: Snowflake
) {
	return baseLog(userId, guildId, moderatorId, reason, 'Ban');
}

export function logKick(
	userId: Snowflake,
	guildId: Snowflake,
	reason?: string,
	moderatorId?: Snowflake
) {
	return baseLog(userId, guildId, moderatorId, reason, 'Kick');
}

export function logWarn(
	userId: Snowflake,
	guildId: Snowflake,
	reason?: string,
	moderatorId?: Snowflake
) {
	return baseLog(userId, guildId, moderatorId, reason, 'Warn');
}

export function logEndTimeout(
	userId: Snowflake,
	guildId: Snowflake,
	reason?: string,
	moderatorId?: Snowflake
) {
	return baseLog(userId, guildId, moderatorId, reason, 'End Timeout');
}
