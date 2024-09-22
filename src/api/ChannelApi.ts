import { Session } from '@supabase/supabase-js';

import { supabase } from '@/supabase';
import { Database } from '@/types/supabase';

export class ChannelApi {
	private constructor() {}

	static async getAll() {
		const { data } = await supabase.from('channels').select('*, channels_members ( * )');
		const channels = data?.map(({ channels_members, ...rest }) => rest);

		return { channels, data };
	}

	static async getFromId(id: string) {
		const { data } = await supabase.from('channels').select('*, channels_members ( * )').eq('id', id).single();

		return data;
	}

	static async getMembersFromId(id: string) {
		const { data } = await supabase
			.from('channels_members')
			.select('*, profiles ( *, user_activity ( * ) )')
			.eq('channel_id', id);

		return data;
	}

	static async getMemberFromId({ userId, channelId }: { userId: string; channelId: string }) {
		const { data } = await supabase
			.from('channels_members')
			.select('*, profiles!channels_members_user_id_fkey ( *, user_activity ( * ) )')
			.eq('user_id', userId)
			.eq('channel_id', channelId)
			.single();

		return data;
	}

	static async create(channelName: string, profile: Database['public']['Tables']['profiles']['Row']) {
		const { data } = await supabase
			.from('channels')
			.insert([{ slug: channelName, created_by: profile?.id! }])
			.select('*, channels_members ( * )')
			.single();

		const { data: member } = await supabase
			.from('channels_members')
			.insert([{ user_id: profile.id, channel_id: data?.id!, invited_by: profile.id }]);

		data?.channels_members.push(member!);

		return data;
	}

	static async delete(channelName: string) {
		const { data } = await supabase
			.from('channels')
			.delete()
			.eq('slug', channelName)
			.select('*, channels_members ( * )')
			.single();

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

	static async deleteUser({ userId, channelId }: { userId: string; channelId: string }) {
		const { data } = await supabase
			.from('channels_members')
			.delete()
			.eq('user_id', userId)
			.eq('channel_id', channelId)
			.select('*, profiles!channels_members_user_id_fkey ( * )')
			.single();

		return data;
	}

	static async leave(id: number) {
		const { data } = await supabase.from('channels_members').delete().eq('channel_id', id).select().single();

		return data;
	}
}
