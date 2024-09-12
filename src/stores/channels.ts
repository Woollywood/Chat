import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

import { Database } from '@/types/supabase';
import { ChannelApi } from '@/api/ChannelApi';

export type Status = 'successful' | 'loading';
export type LoadingChannel = {
	id: number;
	slug: string;
};
export type SuccessfulChannel = Database['public']['Tables']['channels']['Row'] & {
	channels_members: Database['public']['Tables']['channels_members']['Row'][];
};

interface InitialState {
	channels:
		| {
				data: SuccessfulChannel | LoadingChannel;
				status: Status;
		  }[]
		| null;
}

const initialState: InitialState = {
	channels: null,
};

export const getChannels = createAsyncThunk('@@channels/get', async () => {
	return await ChannelApi.getAll();
});

export const getChannel = createAsyncThunk('@channels/get/current', async ({ id }: { id: string }) => {
	return await ChannelApi.getFromId(id);
});

export const createChannel = createAsyncThunk(
	'@@channels/create',
	async ({ name, profile }: { name: string; profile: Database['public']['Tables']['profiles']['Row'] }) => {
		return await ChannelApi.create(name, profile);
	},
);

export const deleteChannel = createAsyncThunk('@@channels/delete', async ({ name }: { name: string }) => {
	return await ChannelApi.delete(name);
});

export const leaveChannel = createAsyncThunk('@@channels/leave', async (id: number) => {
	return await ChannelApi.leave(id);
});

const slice = createSlice({
	name: 'channels',
	initialState,
	reducers: {
		exclusionFromChannel: (state, { payload }: PayloadAction<number>) => ({
			channels: state.channels?.filter((channel) => channel.data.id !== payload)!,
		}),
		insertMember: (state, { payload }: PayloadAction<Database['public']['Tables']['channels_members']['Row']>) => ({
			channels: state.channels?.map((channel) => ({
				...channel,
				data: {
					...channel.data,
					channels_members: [...(channel.data as SuccessfulChannel).channels_members, payload],
				},
			}))!,
		}),
		deleteMember: (state, { payload }: PayloadAction<number>) => ({
			channels: state.channels?.map((channel) => ({
				...channel,
				data: {
					...channel.data,
					channels_members: (channel.data as SuccessfulChannel).channels_members.filter(
						(member) => member.id !== payload,
					),
				},
			}))!,
		}),
	},
	extraReducers: (builder) => {
		builder
			.addCase(getChannels.fulfilled, (state, { payload }) => {
				state.channels = payload?.map((channel) => ({
					status: 'successful',
					data: channel,
				}))!;
			})
			.addCase(createChannel.pending, (state, { meta }) => {
				const maxId = Math.max(...state.channels?.map((channel) => channel.data.id)!);

				state.channels?.push({
					status: 'loading',
					data: {
						id: maxId + 1,
						slug: meta.arg.name,
					},
				});
			})
			.addCase(createChannel.fulfilled, (state, { payload }) => ({
				channels: state.channels?.map((channel) =>
					channel.data.slug === payload?.slug
						? {
								status: 'successful',
								data: payload,
							}
						: channel,
				)!,
			}))
			.addCase(deleteChannel.pending, (state, { meta }) => ({
				channels: state.channels?.map((channel) =>
					channel.data.slug === meta.arg.name ? { ...channel, status: 'loading' } : channel,
				)!,
			}))
			.addCase(deleteChannel.fulfilled, (state, { payload }) => ({
				channels: state.channels?.filter((channel) => channel.data.id !== payload?.id)!,
			}))
			.addCase(leaveChannel.fulfilled, (state, { payload }) => ({
				channels: state.channels?.filter((channel) => channel.data.id !== payload?.channel_id)!,
			}))
			.addCase(getChannel.fulfilled, (state, { payload }) => ({
				channels: state.channels?.concat([{ status: 'successful', data: payload! }])!,
			}));
	},
});

export const { exclusionFromChannel, insertMember, deleteMember } = slice.actions;
export const reducer = slice.reducer;
