import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { getMessages, deleteMessage } from './actions';
import { InitialState, StoreMessage } from './types';

const initialState: InitialState = {
	messages: null,
};

export const slice = createSlice({
	name: 'channels_messages',
	initialState,
	reducers: {
		insertMessage: (state, { payload }: PayloadAction<StoreMessage>) => {
			state.messages?.push({
				...payload,
				repliedMessage: payload.replied_to
					? (() => {
							const message = state.messages?.find((message) => message.id === payload.replied_to);
							// eslint-disable-next-line @typescript-eslint/no-unused-vars
							const { repliedMessage, ...rest } = message!;

							return rest;
						})()
					: null,
			});
		},
		deleteMessage: (state, { payload }: PayloadAction<number>) => ({
			messages: state.messages?.filter((message) => message.id !== payload)!,
		}),
	},
	extraReducers: (builder) => {
		builder
			.addCase(getMessages.fulfilled, (_, { payload }) => ({
				messages: payload,
			}))
			.addCase(deleteMessage.fulfilled, (state, { payload }) => ({
				messages: state.messages?.filter((message) => message.id !== payload?.id)!,
			}));
	},
});
