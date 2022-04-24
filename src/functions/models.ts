import profileModel from '../models/profileSchema';
import profileInServerModel from '../models/profileInServerSchema';
import serverModel from '../models/serverSchema';
import { Profile, ProfileInServer, ServerData } from '../types';

export function updateProfile(
	data: any,
	userID: string
): Promise<Profile> {
	const filter = { userID };
	return (
		profileModel.findOneAndUpdate(filter, data, {
			new: true
		}) ?? profileModel.create(userID)
	);
}
export function updateServer(
	data: any,
	serverID: string
): Promise<ServerData> {
	return serverModel.findOneAndUpdate({ serverID }, data, {
		new: true
	});
}

export function updateProfileInServer(
	data: any,
	userID: string,
	serverID: string
): Promise<ProfileInServer> {
	const filter = {
		userID,
		serverID
	};
	return (
		profileInServerModel.findOneAndUpdate(filter, data, {
			new: true
		}) ??
		profileModel.create({
			...filter,
			mincoDollars: 100,
			bank: 0
		})
	);
}

export function getProfile(userID: string): Promise<Profile> {
	return (
		profileModel.findOne({ userID }) ??
		profileModel.create({
			userID
		})
	);
}

export function getProfileInServer(
	userID: string,
	serverID: string
): Promise<ProfileInServer> {
	return (
		profileInServerModel.findOne({
			userID,
			serverID
		}) ??
		profileInServerModel.create({
			userID,
			serverID
		})
	);
}

export function getServer(serverID: string): Promise<ServerData> {
	return serverModel.findOne({
		serverID
	});
}
