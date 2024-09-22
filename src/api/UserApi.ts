import moment from 'moment';

import { supabase } from '@/supabase';
import { Database } from '@/types/supabase';

export class UserApi {
	private constructor() {}

	static async setActivity(status: Database['public']['Enums']['user_status'], userId: string) {
		await supabase
			.from('user_activity')
			.update({ last_seen: moment().utc().format('YYYY-MM-DD HH:mm:ss+00'), status })
			.eq('user_id', userId);
	}
}
