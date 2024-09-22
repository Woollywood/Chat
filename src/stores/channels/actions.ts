import { createAsyncThunk } from '@reduxjs/toolkit';

import { ChannelApi } from '@/api/ChannelApi';
import { Database } from '@/types/supabase';

const typePrefix = '@@channels';

export const getChannels = createAsyncThunk(`${typePrefix}/get`, async () => {
	return await ChannelApi.getAll();
});

export const getChannel = createAsyncThunk(`${typePrefix}/getFromId`, async (id: string) => {
	return await ChannelApi.getFromId(id);
});

export const createChannel = createAsyncThunk(
	`${typePrefix}/create`,
	async ({ name, profile }: { name: string; profile: Database['public']['Tables']['profiles']['Row'] }) => {
		return await ChannelApi.create(name, profile);
	},
);

export const deleteChannel = createAsyncThunk(`${typePrefix}/delete`, async (id: number) => {
	return await ChannelApi.delete(id);
});

export const leaveChannel = createAsyncThunk(`${typePrefix}/leave`, async (id: number) => {
	return await ChannelApi.leave(id);
});
