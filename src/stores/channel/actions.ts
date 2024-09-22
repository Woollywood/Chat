import { createAsyncThunk } from '@reduxjs/toolkit';
import { Session } from '@supabase/supabase-js';

import { ChannelApi } from '@/api/ChannelApi';
import { Database } from '@/types/supabase';

export const getChannel = createAsyncThunk('@@channel/get', async ({ id }: { id: string }) => {
	const channel = await ChannelApi.getFromId(id);
	const members = await ChannelApi.getChannelMembers(id);

	return { channel, members };
});

export const inviteUser = createAsyncThunk(
	'@@channel/inviteUser',
	async ({
		channel,
		userId,
		session,
	}: {
		channel: Database['public']['Tables']['channels']['Row'];
		userId: string;
		session: Session;
	}) => {
		return await ChannelApi.inviteUser(channel, userId, session);
	},
);

export const deleteUser = createAsyncThunk(
	'@@channel/deleteUser',
	async ({ userId, channelId }: { userId: string; channelId: string }) => {
		return await ChannelApi.deleteUser({ userId, channelId });
	},
);

export const insertUserFromId = createAsyncThunk(
	'@@channel/insertUserFromId',
	async ({ userId, channelId }: { userId: string; channelId: string }) => {
		return await ChannelApi.getMemberFromId({ userId, channelId });
	},
);
