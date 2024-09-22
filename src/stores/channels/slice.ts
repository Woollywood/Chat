import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { InitialState } from './types';
import {
	getChannels as getChannelsAction,
	getChannel as getChannelAction,
	createChannel as createChannelAction,
	deleteChannel as deleteChannelAction,
	leaveChannel as leaveChannelAction,
} from './actions';

import { Database } from '@/types/supabase';

const initialState: InitialState = {
	channels: null,
};

export const slice = createSlice({
	name: 'channels',
	initialState,
	reducers: {
		deleteChannel: (state, { payload }: PayloadAction<number>) => ({
			channels: state.channels?.filter((channel) => channel.id !== payload)!,
		}),
		insertMember: (state, { payload }: PayloadAction<Database['public']['Tables']['channels_members']['Row']>) => {
			state.channels = state.channels?.map((channel) => ({
				...channel,
				channels_members: [...channel.channels_members, payload],
			}))!;
		},
		deleteMember: (state, { payload }: PayloadAction<number>) => {
			state.channels = state.channels?.map((channel) => ({
				...channel,
				channels_members: channel.channels_members.filter((member) => member.id !== payload),
			}))!;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(getChannelsAction.fulfilled, (_, { payload }) => ({
				channels: payload!,
			}))
			.addCase(getChannelAction.fulfilled, (state, { payload }) => {
				state.channels?.push(payload!);
			})
			.addCase(createChannelAction.fulfilled, (state, { payload }) => {
				state.channels?.push(payload!);
			})
			.addCase(deleteChannelAction.fulfilled, (state, { payload }) => ({
				channels: state.channels?.filter((channel) => channel.id !== payload?.id)!,
			}))
			.addCase(leaveChannelAction.fulfilled, (state, { payload }) => ({
				channels: state.channels?.filter((channel) => channel.id !== payload?.id)!,
			}));
	},
});
