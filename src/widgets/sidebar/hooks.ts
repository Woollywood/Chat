import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RealtimePostgresInsertPayload } from '@supabase/supabase-js';

import { AppDispatch, RootState } from '@/store';
import {
	getChannelsAction,
	getChannelAction,
	deleteChannel,
	insertMember,
	deleteMember as deleteMemberFromChannels,
	RelatedChannels,
} from '@/stores/channels';
import { insertUserFromId, deleteMember as deleteMemberFromCurrentChannel } from '@/stores/channel';
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

	function wsInsertMember(
		payload: RealtimePostgresInsertPayload<Database['public']['Tables']['channels_members']['Row']>,
	) {
		if (channel?.id === payload.new.channel_id) {
			dispatch(insertUserFromId({ userId: payload.new.user_id, channelId: payload.new.channel_id.toString() }));
			dispatch(insertMember(payload.new));
		} else {
			dispatch(insertMember(payload.new));
		}
	}
	function wsInsertChannel(
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

	function wsDeleteChannel(channel: RelatedChannels) {
		dispatch(deleteChannel(channel.id));
	}
	function wsDeleteMember(member: Database['public']['Tables']['channels_members']['Row']) {
		if (member.channel_id === channel?.id) {
			dispatch(deleteMemberFromCurrentChannel(member.id));
		}
		dispatch(deleteMemberFromChannels(member.id));
	}
	function wsDel(
		payload: RealtimePostgresInsertPayload<Database['public']['Tables']['deleted_channels_members']['Row']>,
	) {
		if (payload.new.user_id === profile?.id) {
			wsDeleteChannel(payload.new);
		} else {
			wsDeleteMember(payload.new);
		}
	}

	useEffect(() => {
		const channelIds = channels?.map((channel) => channel.id);
		const filter = channelIds?.length! > 0 ? `channel_id=in.(${channelIds?.join(',')})` : undefined;

		WebSocketService.subscribe<Database['public']['Tables']['channels_members']['Row']>({
			name: 'live-chat-members',
			table: 'channels_members',
			filter,
		}).insert(wsInsertMember);
		WebSocketService.subscribe<Database['public']['Tables']['deleted_channels_members']['Row']>({
			name: 'live-chat-members-deleted',
			table: 'deleted_channels_members',
			filter,
		}).insert(wsDel);

		return () => {
			WebSocketService.unsubscribeAll({ name: 'live-chat-members' });
			WebSocketService.unsubscribeAll({ name: 'live-chat-members-deleted' });
		};
	}, [wsInsertMember, wsDel]);

	useEffect(() => {
		const filter = profile?.id ? `user_id=eq.${profile.id}` : undefined;

		WebSocketService.subscribe<Database['public']['Tables']['channels_members']['Row']>({
			name: 'live-chat-members-for-current-user',
			table: 'channels_members',
			filter,
		}).insert(wsInsertChannel);

		return () => {
			WebSocketService.unsubscribeAll({ name: 'live-chat-members-for-current-user' });
		};
	}, [wsInsertChannel]);
}
