import { MutableRefObject, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { ActionType } from '../../reducer';
import { useLiveChatContext, useLiveChatDispatchContext } from '../../context';

import { WebSocketService } from '@/services/WebSocketService';
import {
	getMessagesAction,
	insertMessage,
	deleteMessage,
	updateMessage,
	editMessageAction,
} from '@/stores/channelsMessages';
import { AppDispatch, RootState } from '@/store';
import { Database } from '@/types/supabase';
import { MessagesApi } from '@/api/MessagesApi';

export function useMessages(messagesContainer: MutableRefObject<HTMLDivElement | null>) {
	const params = useParams();
	const channelId = +params.id!;

	const [isLoading, setLoading] = useState(true);
	const { members } = useSelector((state: RootState) => state.channel);
	const channelProfiles = useMemo(() => members?.map((member) => member.profiles), [members]);

	const dispatch = useDispatch<AppDispatch>();

	function scrollBottom() {
		const innerContainer = messagesContainer.current?.firstChild as HTMLButtonElement;

		messagesContainer.current?.scrollTo({ top: innerContainer.clientHeight });
	}

	async function fetchMessages() {
		setLoading(true);
		await dispatch(getMessagesAction({ channelId }));
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

		WebSocketService.subscribe<Database['public']['Tables']['channels_messages']['Row']>({
			name: 'channels_messages',
			table: 'channels_messages',
		}).del((payload) => {
			dispatch(deleteMessage(payload.old.id!));
		});

		WebSocketService.subscribe<Database['public']['Tables']['channels_messages']['Row']>({
			name: 'channels_messages',
			table: 'channels_messages',
		}).update((payload) => {
			const { new: message } = payload;

			dispatch(updateMessage({ id: message.id, text: message.text }));
		});

		return () => {
			WebSocketService.unsubscribeAll({ name: 'channels_messages' });
		};
	}, [members]);

	return { isLoading };
}

export function useControls() {
	const [isLoading, setLoading] = useState(false);
	const { state, message } = useLiveChatContext()!;
	const { profile } = useSelector((state: RootState) => state.session);
	const dispatchContext = useLiveChatDispatchContext()!;
	const dispatch = useDispatch<AppDispatch>();

	const { id: channelId } = useParams();

	async function handleSend() {
		const trimmedMessage = message.trim();

		if (trimmedMessage.length > 0) {
			setLoading(true);
			switch (state?.type) {
				case 'reply':
					await MessagesApi.reply(+channelId!, profile?.id!, state.message.id, trimmedMessage);
					break;
				case 'edit':
					await dispatch(editMessageAction({ id: state.message.id, text: trimmedMessage }));
					break;
				default:
					await MessagesApi.send(+channelId!, profile?.id!, trimmedMessage);
			}
			dispatchContext({ type: ActionType.RESET_STATE });
			setLoading(false);
			dispatchContext({ type: ActionType.CHANGE_MESSAGE, payload: '' });
		}
	}

	return { isLoading, handleSend };
}
