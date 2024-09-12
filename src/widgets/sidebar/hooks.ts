import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RealtimePostgresDeletePayload, RealtimePostgresInsertPayload } from '@supabase/supabase-js';

import { AppDispatch, RootState } from '@/store';
import {
	getChannels,
	getChannel,
	SuccessfulChannel,
	exclusionFromChannel,
	insertMember,
	deleteMember,
	Status,
} from '@/stores/channels';
import { insertUserFromId, exclusionMember } from '@/stores/channel';
import { Database } from '@/types/supabase';
import { WebSocketService } from '@/services/WebSocketService';

export function useChannels() {
	const dispatch = useDispatch<AppDispatch>();
	const [isChannelsLoading, setChannelsLoading] = useState(true);

	useEffect(() => {
		dispatch(getChannels()).then(() => setChannelsLoading(false));
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
				getChannel({
					id: payload.new.channel_id.toString(),
				}),
			);
		}
	}
	function insert(payload: RealtimePostgresInsertPayload<Database['public']['Tables']['channels_members']['Row']>) {
		if (channels?.find((channel) => channel.data.id === payload.new.channel_id)) {
			payloadInsertMember(payload);
		} else {
			payloadInserChannel(payload);
		}
	}

	function payloadDeleteChannel(channel: { data: SuccessfulChannel; status: Status }) {
		dispatch(exclusionFromChannel(channel.data.id));
	}
	function payloadDeleteMember(member: Database['public']['Tables']['channels_members']['Row']) {
		dispatch(exclusionMember(member.id));
		dispatch(deleteMember(member.id));
	}
	function del(payload: RealtimePostgresDeletePayload<Database['public']['Tables']['channels_members']['Row']>) {
		const rowId = payload.old.id!;
		const channelFounded = channels?.find((channel) =>
			(channel.data as SuccessfulChannel).channels_members.some((member) => member.id === rowId),
		);

		if (channelFounded) {
			const member = (channelFounded?.data as SuccessfulChannel).channels_members.find(
				(member) => member.id === rowId,
			);

			if (member?.user_id === profile?.id) {
				payloadDeleteChannel(channelFounded as { data: SuccessfulChannel; status: Status });
			} else if (member?.channel_id === channel?.id) {
				payloadDeleteMember(member!);
			}
		}
	}

	useEffect(() => {
		WebSocketService.subscribe<Database['public']['Tables']['channels_members']['Row']>({
			name: 'live-chat-members',
			table: 'channels_members',
		}).insert(insert);
		WebSocketService.subscribe<Database['public']['Tables']['channels_members']['Row']>({
			name: 'live-chat-members',
			table: 'channels_members',
		}).del(del);

		return () => {
			WebSocketService.unsubscribeAll({ name: 'live-chat-members' });
		};
	}, [insert, del]);
}
