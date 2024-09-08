import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

import { AppDispatch, RootState } from '@/store';
import {
	getChannels,
	getChannel,
	SuccessfulChannel,
	exclusionFromChannel,
	Status,
	LoadingChannel,
} from '@/stores/channels';
import { ChannelApi } from '@/api/ChannelApi';
import { Database } from '@/types/supabase';

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
	const { profile } = useSelector((state: RootState) => state.session);
	const socket = ChannelApi.getMembersSocketInstance();

	function payloadInsertChannel(
		payload: RealtimePostgresChangesPayload<{
			[key: string]: any;
		}>,
	) {
		const payloadNew = payload.new as Database['public']['Tables']['channels_members']['Row'];

		if (payloadNew.user_id === profile?.id) {
			dispatch(
				getChannel({
					id: payloadNew.channel_id.toString(),
				}),
			);
		}
	}

	function payloadInsertMember(
		payload: RealtimePostgresChangesPayload<{
			[key: string]: any;
		}>,
	) {
		console.log(payload);
	}

	function payloadDeleteChannel(
		payload: RealtimePostgresChangesPayload<{
			[key: string]: any;
		}>,
		channel: {
			data: SuccessfulChannel | LoadingChannel;
			status: Status;
		},
		rowId: number,
	) {
		const member = (channel?.data as SuccessfulChannel).channels_members.find((member) => member.id === rowId);

		if (member?.user_id === profile?.id) {
			dispatch(exclusionFromChannel(channel.data.id));
		}
	}

	function payloadDeleteMember(
		payload: RealtimePostgresChangesPayload<{
			[key: string]: any;
		}>,
	) {
		console.log(payload);
	}

	function updateChannels({
		eventType,
		...payload
	}: RealtimePostgresChangesPayload<{
		[key: string]: any;
	}>) {
		switch (eventType) {
			case 'INSERT': {
				const payloadNew = payload.new as Database['public']['Tables']['channels_members']['Row'];

				if (channels?.find((channel) => channel.data.id === payloadNew.channel_id)) {
					payloadInsertMember({ eventType, ...payload });
				} else {
					payloadInsertChannel({ eventType, ...payload });
				}

				return;
			}
			case 'DELETE': {
				const rowId = (payload.old as { id: number }).id;
				const channel = channels?.find((channel) =>
					(channel.data as SuccessfulChannel).channels_members.some((member) => member.id === rowId),
				);

				if (channel) {
					payloadDeleteChannel({ eventType, ...payload }, channel, rowId);
				} else {
					payloadDeleteMember({ eventType, ...payload });
				}

				return;
			}
		}
	}

	useEffect(() => {
		socket.connect(updateChannels);

		return () => {
			socket.disconnect();
		};
	}, [updateChannels]);
}
