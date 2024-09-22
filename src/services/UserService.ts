import { Session } from '@supabase/supabase-js';

import { Database } from '@/types/supabase';
import { UserApi } from '@/api/UserApi';

class _UserActivityService {
	private intervalId: NodeJS.Timeout | null = null;
	private session: Session | null = null;

	async setActivity(status: Database['public']['Enums']['user_status']) {
		await UserApi.setActivity(status, this.session?.user.id!);
	}

	async init(session: Session) {
		this.session = session;
		this.setActivity('ONLINE');
		this.intervalId = setInterval(
			() => {
				this.setActivity('ONLINE');
			},
			1000 * 60 * 4,
		);
	}

	destroy() {
		this.session = null;
		clearInterval(this.intervalId!);
	}
}

export const UserActivityService = new _UserActivityService();
