import { modelClient } from '../main';
import { Profile } from 'mincomodels/profileSchema/types';
import { ProfileInServer } from 'mincomodels/profileInServerSchema/types';
import { ServerData } from 'mincomodels/serverSchema/types';
import { FilterQuery } from 'mongoose';

const { profileModel, serverModel, profileInServerModel } =
	modelClient;

export function updateProfile(
	data: FilterQuery<Profile>,
	userId: string
) {
	return profileModel.findOneAndUpdate({ userID: userId }, data, {
		new: true,
		upsert: true
	});
}

export function updateServer(
	data: FilterQuery<ServerData>,
	serverId: string
) {
	return serverModel.findOneAndUpdate({ serverID: serverId }, data, {
		new: true
	});
}

export function updateProfileInServer(
	data: FilterQuery<ProfileInServer>,
	userId: string,
	serverId: string
) {
	const filter = {
		userID: userId,
		serverID: serverId
	};
	return profileInServerModel.findOneAndUpdate(filter, data, {
		new: true,
		upsert: true
	});
}

export function getProfile(userId: string) {
	return profileModel.findOne({ userID: userId }, undefined, {
		upsert: true
	});
}

export function getProfileInServer(userId: string, serverId: string) {
	const filter = {
		userID: userId,
		serverID: serverId
	};
	return profileInServerModel.findOne(filter, undefined, {
		upsert: true
	});
}

export function getServer(serverId: string) {
	return serverModel.findOne(
		{
			serverID: serverId
		},
		undefined,
		{
			upsert: true
		}
	);
}
