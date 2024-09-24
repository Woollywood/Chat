import { MutableRefObject, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { WebSocketService } from '@/services/WebSocketService';
import { getMessages, insertMessage } from '@/stores/channelsMessages';
import { AppDispatch, RootState } from '@/store';
import { Database } from '@/types/supabase';

export function useMessages(channelId: number, messagesContainer: MutableRefObject<HTMLDivElement | null>) {
	const { members } = useSelector((state: RootState) => state.channel);
	const channelProfiles = useMemo(() => members?.map((member) => member.profiles), [members]);

	const dispatch = useDispatch<AppDispatch>();

	useEffect(() => {
		if (!channelId) {
			return;
		}

		dispatch(getMessages({ channelId })).then(() => {
			const innerContainer = messagesContainer.current?.firstChild as HTMLDivElement;

			messagesContainer.current?.scrollTo({ top: innerContainer.clientHeight });
		});

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

			setTimeout(() => {
				const innerContainer = messagesContainer.current?.firstChild as HTMLDivElement;

				messagesContainer.current?.scrollTo({ top: innerContainer.clientHeight });
			}, 0);
		});

		return () => {
			WebSocketService.unsubscribeAll({ name: 'channels_messages' });
		};
	}, [channelId]);
}
