import moment from 'moment';

import { supabase } from '@/supabase';

class UserActivityService {
	private intervalId: NodeJS.Timeout | null = null;
	private _userId: string | null = null;

	constructor(userId?: string) {
		this._userId = userId ?? null;
	}

	set userId(userId: string) {
		this._userId = userId;
	}

	async setActivity() {
		await supabase
			.from('user_activity')
			.update({ last_seen: moment().utc().format('YYYY-MM-DD HH:mm:ss+00'), status: 'ONLINE' })
			.eq('user_id', this._userId!);
	}

	async init() {
		this.setActivity();
		this.intervalId = setInterval(
			() => {
				this.setActivity();
			},
			1000 * 60 * 4,
		);
	}

	destroy() {
		if (this.intervalId) {
			clearInterval(this.intervalId);
		}
	}
}

export class UserServiceFabric {
	private static UserActivityInstance: UserActivityService | null = null;

	private constructor() {}

	public static getUserActivity(userId?: string) {
		if (!this.UserActivityInstance) {
			this.UserActivityInstance = new UserActivityService(userId);
		}

		return this.UserActivityInstance;
	}
}
