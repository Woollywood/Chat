import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Session } from '@supabase/supabase-js';

import { supabase } from '@/supabase';
import { Database } from '@/types/supabase';

export interface InitialState {
	isComplete: boolean;
	profile: Database['public']['Tables']['profiles']['Row'] | null;
	activity: Database['public']['Tables']['user_activity']['Row'] | null;
	role: Database['public']['Tables']['user_roles']['Row'] | null;
	session: Session | null;
}

const initialState: InitialState = {
	isComplete: false,
	profile: null,
	activity: null,
	role: null,
	session: null,
};

export const getUserProfileFromSession = createAsyncThunk('@@session/getProfile', async (session: Session) => {
	const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
	const { data: activity } = await supabase.from('user_activity').select('*').eq('user_id', session.user.id).single();
	const { data: role } = await supabase.from('user_roles').select('*').eq('user_id', session.user.id).single();

	return {
		role,
		session,
		profile,
		activity,
	};
});

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

export const { resetSession } = slice.actions;
export const reducer = slice.reducer;
