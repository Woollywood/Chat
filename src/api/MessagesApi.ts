import { supabase } from '@/supabase';

export class MessagesApi {
	private constructor() {}

	static async getAll(channelId: number) {
		const { data } = await supabase
			.from('channels_messages')
			.select('*, profiles ( * )')
			.eq('channel_id', channelId)
			.order('id', { ascending: true });

		return data;
	}

	static async send(channelId: number, userId: string, text: string) {
		const { data } = await supabase
			.from('channels_messages')
			.insert([{ channel_id: channelId, user_id: userId, text }])
			.select();

		return data;
	}
}
