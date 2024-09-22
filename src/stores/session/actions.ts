import { createAsyncThunk } from '@reduxjs/toolkit';
import { Session } from '@supabase/supabase-js';

import { supabase } from '@/supabase';

const typePrefix = '@@session';

export const getUserProfileFromSession = createAsyncThunk(`${typePrefix}/get`, async (session: Session) => {
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
