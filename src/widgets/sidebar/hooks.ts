import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RealtimePostgresInsertPayload } from '@supabase/supabase-js';

import { AppDispatch, RootState } from '@/store';
import {
	getChannelsAction,
	getChannelAction,
	deleteChannel,
	insertMember,
	deleteMember,
	RelatedChannels,
} from '@/stores/channels';
import { insertUserFromId, exclusionMember } from '@/stores/channel';
import { Database } from '@/types/supabase';
import { WebSocketService } from '@/services/WebSocketService';

export function useChannels() {
	const dispatch = useDispatch<AppDispatch>();
	const [isChannelsLoading, setChannelsLoading] = useState(true);

	useEffect(() => {
		dispatch(getChannelsAction()).then(() => setChannelsLoading(false));
	}, []);

	return { isChannelsLoading };
}

export function useSocket() {
	const dispatch = useDispatch<AppDispatch>();
	const { channels } = useSelector((state: RootState) => state.channels);
	const { channel } = useSelector((state: RootState) => state.channel);
	const { profile } = useSelector((state: RootState) => state.session);

	function payloadInsertMember(
		payload: RealtimePostgresInsertPayload<Database['public']['Tables']['channels_members']['Row']>,
	) {
		if (channel?.id === payload.new.channel_id) {
			dispatch(insertUserFromId({ userId: payload.new.user_id, channelId: payload.new.channel_id.toString() }));
			dispatch(insertMember(payload.new));
		} else {
			dispatch(insertMember(payload.new));
		}
	}
	function payloadInserChannel(
		payload: RealtimePostgresInsertPayload<Database['public']['Tables']['channels_members']['Row']>,
	) {
		if (payload.new.user_id === profile?.id) {
			dispatch(
				getChannelAction({
					id: payload.new.channel_id.toString(),
				}),
			);
		}
	}
	function insert(payload: RealtimePostgresInsertPayload<Database['public']['Tables']['channels_members']['Row']>) {
		if (channels?.find((channel) => channel.id === payload.new.channel_id)) {
			payloadInsertMember(payload);
		} else {
			payloadInserChannel(payload);
		}
	}

	function payloadDeleteChannel(channel: RelatedChannels) {
		dispatch(deleteChannel(channel.id));
	}
	function payloadDeleteMember(member: Database['public']['Tables']['channels_members']['Row']) {
		dispatch(exclusionMember(member.id));
		dispatch(deleteMember(member.id));
	}
	function del(
		payload: RealtimePostgresInsertPayload<Database['public']['Tables']['deleted_channels_members']['Row']>,
	) {
		console.log('del');
		console.log(payload);

		const rowId = payload.new.id!;
		const channelFounded = channels?.find((channel) =>
			channel.channels_members.some((member) => member.id === rowId),
		);
		const member = channelFounded?.channels_members.find((member) => member.id === rowId);

		if (member?.user_id === profile?.id) {
			payloadDeleteChannel(channelFounded!);
		} else if (member?.channel_id === channel?.id) {
			payloadDeleteMember(member!);
		}
	}

	useEffect(() => {
		const channelIds = channels?.map((channel) => channel.id);
		const filter = channelIds?.length! > 0 ? `channel_id=in.(${channelIds?.join(',')})` : undefined;

		WebSocketService.subscribe<Database['public']['Tables']['channels_members']['Row']>({
			name: 'live-chat-members',
			table: 'channels_members',
			filter,
		}).insert(insert);
		WebSocketService.subscribe<Database['public']['Tables']['deleted_channels_members']['Row']>({
			name: 'live-chat-members-deleted',
			table: 'deleted_channels_members',
			filter,
		}).insert(del);

		return () => {
			WebSocketService.unsubscribeAll({ name: 'live-chat-members' });
			WebSocketService.unsubscribeAll({ name: 'live-chat-members-deleted' });
		};
	}, [insert, del]);

	useEffect(() => {
		const filter = profile?.id ? `user_id=eq.${profile.id}` : undefined;

		WebSocketService.subscribe<Database['public']['Tables']['channels_members']['Row']>({
			name: 'live-chat-members-for-current-user',
			table: 'channels_members',
			filter,
		}).insert(payloadInserChannel);

		return () => {
			WebSocketService.unsubscribeAll({ name: 'live-chat-members-for-current-user' });
		};
	}, [insert, del]);
}
