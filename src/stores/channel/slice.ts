import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { InitialState } from './types';
import { getChannel, inviteUser, deleteUser, insertUserFromId } from './actions';

import { Database } from '@/types/supabase';

const initialState: InitialState = {
	channel: null,
	members: null,
};

export const slice = createSlice({
	name: 'channel',
	initialState,
	reducers: {
		updateMemberActivity: (
			state,
			{ payload }: PayloadAction<Database['public']['Tables']['user_activity']['Row']>,
		) => {
			state.members = state.members?.map((member) =>
				member.user_id === payload.user_id
					? {
							...member,
							profiles: {
								...member.profiles!,
								user_activity: payload,
							},
						}
					: member,
			)!;
		},
		deleteMember: (state, { payload }: PayloadAction<number>) => {
			state.members = state.members?.filter((member) => member.id !== payload)!;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(getChannel.fulfilled, (state, { payload }) => {
				const { channel, members } = payload;

				state.channel = channel;
				state.members = members;
			})
			.addCase(inviteUser.fulfilled, (state, { payload }) => {
				state.members = state.members?.concat(payload!)!;
			})
			.addCase(deleteUser.fulfilled, (state, { payload }) => {
				state.members = state.members?.filter((member) => member.id !== payload?.id)!;
			})
			.addCase(insertUserFromId.fulfilled, (state, { payload }) => {
				state.members?.push(payload!);
			});
	},
});
