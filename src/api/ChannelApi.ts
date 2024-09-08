import {
	RealtimeChannel,
	RealtimePostgresChangesPayload,
	RealtimePostgresUpdatePayload,
	Session,
} from '@supabase/supabase-js';

import { supabase } from '@/supabase';
import { Database } from '@/types/supabase';

export class ChannelSocket {
	private socket: RealtimeChannel | null = null;

	connect(
		callback: (
			payload: RealtimePostgresUpdatePayload<{
				[key: string]: any;
			}>,
		) => void,
	) {
		if (this.socket) {
			this.socket.unsubscribe();
			this.socket = null;
		}

		this.socket = supabase
			.channel('user_activity_UPDATE')
			.on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'user_activity' }, (payload) => {
				if (payload?.new) {
					callback(payload);
				}
			})
			.subscribe();
	}

	disconnect() {
		if (this.socket) {
			this.socket?.unsubscribe();
			this.socket = null;
		}
	}
}

export class MembersSocket {
	private socket: RealtimeChannel | null = null;

	connect(
		callback: (
			payload: RealtimePostgresChangesPayload<{
				[key: string]: any;
			}>,
		) => void,
	) {
		if (this.socket) {
			this.socket.unsubscribe();
			this.socket = null;
		}

		this.socket = supabase
			.channel('members_ALL')
			.on('postgres_changes', { event: '*', schema: 'public', table: 'channels_members' }, (payload) => {
				callback(payload);
			})
			.subscribe();
	}

	disconnect() {
		if (this.socket) {
			this.socket?.unsubscribe();
			this.socket = null;
		}
	}
}

export class ChannelApi {
	private static channelSocketInstance: ChannelSocket | null = null;
	private static membersSocketInstance: MembersSocket | null = null;

	private constructor() {}

	static async getAll() {
		const { data } = await supabase.from('channels').select('*, channels_members ( * )');

		return data;
	}

	static async getFromId(id: string) {
		const { data } = await supabase.from('channels').select('*, channels_members ( * )').eq('id', id).single();

		return data;
	}

	static async create(channelName: string, profile: Database['public']['Tables']['profiles']['Row']) {
		const { data } = await supabase
			.from('channels')
			.insert([{ slug: channelName, created_by: profile?.id! }])
			.select()
			.single();

		await supabase
			.from('channels_members')
			.insert([{ user_id: profile.id, channel_id: data?.id!, invited_by: profile.id }]);

		return data;
	}

	static async delete(channelName: string) {
		const { data } = await supabase.from('channels').delete().eq('slug', channelName).select().single();

		return data;
	}

	static async getChannelMembers(id: string) {
		const { data } = await supabase
			.from('channels_members')
			.select('*, profiles!channels_members_user_id_fkey ( *, user_activity!user_activity_user_id_fkey ( * ) )')
			.eq('channel_id', id);

		return data;
	}

	static async getExcludedMembers(existingUserIds: string[]) {
		const { data } = await supabase
			.from('profiles')
			.select('*, user_activity!user_activity_user_id_fkey ( * )')
			.not('id', 'in', `(${existingUserIds.join(',')})`);

		return data;
	}

	static async inviteUser(
		channel: Database['public']['Tables']['channels']['Row'],
		userId: string,
		session: Session,
	) {
		const { data } = await supabase
			.from('channels_members')
			.insert([{ channel_id: channel?.id!, user_id: userId, invited_by: session?.user.id! }])
			.select('*, profiles!channels_members_user_id_fkey ( *, user_activity!user_activity_user_id_fkey ( * ) )')
			.single();

		return data;
	}

	static async leave(id: number) {
		const { data } = await supabase.from('channels_members').delete().eq('channel_id', id).select().single();

		return data;
	}

	static getChannelSocketInstance() {
		if (!this.channelSocketInstance) {
			this.channelSocketInstance = new ChannelSocket();
		}

		return this.channelSocketInstance;
	}

	static getMembersSocketInstance() {
		if (!this.membersSocketInstance) {
			this.membersSocketInstance = new MembersSocket();
		}

		return this.membersSocketInstance;
	}
}
