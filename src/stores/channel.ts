import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Session } from '@supabase/supabase-js';

import { Database } from '@/types/supabase';
import { ChannelApi } from '@/api/ChannelApi';

interface InitialState {
	isLoading: boolean;
	channel: Awaited<ReturnType<typeof ChannelApi.getFromId>>;
	members: Awaited<ReturnType<typeof ChannelApi.getChannelMembers>>;
}

const initialState: InitialState = {
	isLoading: true,
	channel: null,
	members: null,
};

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

export const deleteUserFromId = createAsyncThunk('@@channel/deleteUserFromId', async () => {});

const slice = createSlice({
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
		exclusionMember: (state, { payload }: PayloadAction<number>) => {
			state.members = state.members?.filter((member) => member.id !== payload)!;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(getChannel.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getChannel.fulfilled, (state, { payload }) => {
				const { channel, members } = payload;

				state.isLoading = false;
				state.channel = channel;
				state.members = members;
			})
			.addCase(inviteUser.pending, (state) => {})
			.addCase(inviteUser.fulfilled, (state, { payload }) => {
				state.members = state.members?.concat(payload!)!;
			})
			.addCase(deleteUser.pending, (state) => {})
			.addCase(deleteUser.fulfilled, (state, { payload }) => {
				state.members = state.members?.filter((member) => member.id !== payload?.id)!;
			})
			.addCase(insertUserFromId.fulfilled, (state, { payload }) => {
				state.members?.push(payload!);
			});
	},
});

export const { updateMemberActivity, exclusionMember } = slice.actions;
export const reducer = slice.reducer;
