import { createSlice } from '@reduxjs/toolkit';

import { InitialState } from './types';
import { getUserProfileFromSession } from './actions';

const initialState: InitialState = {
	isComplete: false,
	profile: null,
	activity: null,
	role: null,
	session: null,
};

export const slice = createSlice({
	name: 'session',
	initialState,
	reducers: {
		resetSession: () => ({
			...initialState,
			isComplete: true,
		}),
	},
	extraReducers: (builder) => {
		builder.addCase(getUserProfileFromSession.fulfilled, (state, { payload }) => {
			state.profile = payload.profile;
			state.role = payload.role;
			state.session = payload.session;
			state.activity = payload.activity;
			state.isComplete = true;
		});
	},
});
