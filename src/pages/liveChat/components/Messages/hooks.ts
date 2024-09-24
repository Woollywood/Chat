import { MutableRefObject, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { WebSocketService } from '@/services/WebSocketService';
import { getMessages, insertMessage } from '@/stores/channelsMessages';
import { AppDispatch, RootState } from '@/store';
import { Database } from '@/types/supabase';

export function useMessages(messagesContainer: MutableRefObject<HTMLDivElement | null>) {
	const params = useParams();
	const channelId = +params.id!;

	const [isLoading, setLoading] = useState(true);
	const { members } = useSelector((state: RootState) => state.channel);
	const channelProfiles = useMemo(() => members?.map((member) => member.profiles), [members]);

	const dispatch = useDispatch<AppDispatch>();

	function scrollBottom() {
		const innerContainer = messagesContainer.current?.firstChild as HTMLDivElement;

		messagesContainer.current?.scrollTo({ top: innerContainer.clientHeight });
	}

	async function fetchMessages() {
		setLoading(true);
		await dispatch(getMessages({ channelId }));
		setLoading(false);
		scrollBottom();
	}

	useEffect(() => {
		if (!channelId) {
			return;
		}

		fetchMessages();
	}, [channelId]);

	useEffect(() => {
		WebSocketService.subscribe<Database['public']['Tables']['channels_messages']['Row']>({
			name: 'channels_messages',
			table: 'channels_messages',
		}).insert((payload) => {
			dispatch(
				insertMessage({
					...payload.new,
					profiles: channelProfiles?.find((profile) => profile?.id === payload.new.user_id)!,
				}),
			);

			setTimeout(scrollBottom, 0);
		});

		return () => {
			WebSocketService.unsubscribeAll({ name: 'channels_messages' });
		};
	}, [members]);

	return { isLoading };
}
