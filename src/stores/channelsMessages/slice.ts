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
			state.messages?.push(payload);
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
