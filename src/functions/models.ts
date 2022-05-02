import profileModel from '../models/profileSchema';
import profileInServerModel from '../models/profileInServerSchema';
import serverModel from '../models/serverSchema';
import { Profile, ProfileInServer, ServerData } from '../types';

export async function updateProfile(
	data: any,
	userID: string
): Promise<Profile> {
	const filter = { userID };
	const exists = await profileModel.exists(filter);
	return exists
		? profileModel.findOneAndUpdate(filter, data, {
				new: true
		  })
		: profileModel.create(userID);
}
export function updateServer(
	data: any,
	serverID: string
): Promise<ServerData> {
	return serverModel.findOneAndUpdate({ serverID }, data, {
		new: true
	});
}

export async function updateProfileInServer(
	data: any,
	userID: string,
	serverID: string
): Promise<ProfileInServer> {
	const filter = {
		userID,
		serverID
	};
	const exists = await profileInServerModel.exists(filter);
	return exists
		? profileInServerModel.findOneAndUpdate(filter, data, {
				new: true
		  })
		: profileModel.create({
				...filter,
				mincoDollars: 100,
				bank: 0
		  });
}

export async function getProfile(userID: string): Promise<Profile> {
	const exists = await profileModel.exists({ userID });
	return exists
		? profileModel.findOne({ userID })
		: profileModel.create({
				userID
		  });
}

export async function getProfileInServer(
	userID: string,
	serverID: string
): Promise<ProfileInServer> {
	const filter = {
		userID,
		serverID
	};
	const exists = await profileInServerModel.exists(filter);
	return exists
		? profileInServerModel.findOne(filter)
		: profileInServerModel.create(filter);
}

export function getServer(serverID: string): Promise<ServerData> {
	return serverModel.findOne({
		serverID
	});
}
