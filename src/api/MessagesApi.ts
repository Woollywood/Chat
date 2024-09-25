import { supabase } from '@/supabase';
import { StoreMessage } from '@/stores/channelsMessages/types';

export class MessagesApi {
	private constructor() {}

	static async getAll(channelId: number) {
		const { data } = await supabase
			.from('channels_messages')
			.select('*, profiles ( * ), repliedMessage:replied_to( *, profiles ( * ) )')
			.eq('channel_id', channelId)
			.order('id', { ascending: true });

		return data as unknown as StoreMessage[];
	}

	static async send(channelId: number, userId: string, text: string) {
		const { data } = await supabase
			.from('channels_messages')
			.insert([{ channel_id: channelId, user_id: userId, text }])
			.select()
			.single();

		return data;
	}

	static async reply(channelId: number, userId: string, replyTo: number, text: string) {
		const { data } = await supabase
			.from('channels_messages')
			.insert([{ channel_id: channelId, user_id: userId, text, replied_to: replyTo }])
			.select()
			.single();

		return data;
	}

	static async del(id: number) {
		const { data } = await supabase.from('channels_messages').delete().eq('id', id).select('*').single();

		return data;
	}
}
