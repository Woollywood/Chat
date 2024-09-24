import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { getMessages } from './actions';
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
	},
	extraReducers: (builder) => {
		builder.addCase(getMessages.fulfilled, (_, { payload }) => ({
			messages: payload,
		}));
	},
});
