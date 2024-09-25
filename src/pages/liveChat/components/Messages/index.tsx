import { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import { Skeleton } from '@nextui-org/skeleton';

import { ActionType } from '../../reducer';
import { useLiveChatContext, useLiveChatDispatchContext } from '../../context';

import { useMessages } from './hooks';
import Message from './components/Message';
import RepliedMessage from './components/RepliedMessage';

import { MessagesApi } from '@/api/MessagesApi';
import { RootState, AppDispatch } from '@/store';
import { StoreMessage } from '@/stores/channelsMessages/types';
import { editMessageAction } from '@/stores/channelsMessages';
import { Textarea } from '@/components/controls/message';

function SkeletonMessage() {
	return (
		<Skeleton className='w-3/5 rounded-lg'>
			<div className='h-6 w-full rounded-lg bg-secondary' />
		</Skeleton>
	);
}

type FormattedMessage = Record<string, { messages: StoreMessage[] }>;

export default function Messages() {
	const [isLoadingMessages, setLoadingMessages] = useState(false);
	const messagesRef = useRef<HTMLDivElement | null>(null);

	const { state, message } = useLiveChatContext()!;
	const dispatch = useDispatch<AppDispatch>();
	const dispatchContext = useLiveChatDispatchContext()!;

	const { messages } = useSelector((state: RootState) => state.channelsMessages);
	const formattedMessages = messages?.reduce<FormattedMessage>((acc, message) => {
		const dateKey = moment(message.created_at).calendar({
			sameDay: '[Today]',
			lastDay: '[Yesterday]',
			lastWeek: '[Last Week]',
			sameElse: 'LL',
		});

		if (!acc[dateKey]) {
			acc[dateKey] = { messages: [] };
		}
		acc[dateKey].messages.push(message);

		return acc;
	}, {});

	const { profile } = useSelector((state: RootState) => state.session);

	const { isLoading } = useMessages(messagesRef);

	const params = useParams();
	const channelId = +params.id!;

	async function handleSend() {
		const trimmedMessage = message.trim();
		console.log(trimmedMessage);

		if (trimmedMessage.length > 0) {
			setLoadingMessages(true);
			switch (state?.type) {
				case 'reply':
					await MessagesApi.reply(channelId, profile?.id!, state.message.id, trimmedMessage);
					break;
				case 'edit':
					await dispatch(editMessageAction({ id: state.message.id, text: trimmedMessage }));
					break;
				default:
					await MessagesApi.send(channelId, profile?.id!, trimmedMessage);
			}
			dispatchContext({ type: ActionType.RESET_STATE });
			setLoadingMessages(false);
			dispatchContext({ type: ActionType.CHANGE_MESSAGE, payload: '' });
		}
	}

	return (
		<div className='grid grid-rows-[1fr_auto] overflow-hidden'>
			<div ref={messagesRef} className='scrollbar'>
				<div className='px-6 py-4'>
					{isLoading ? (
						<div className='space-y-6'>
							<SkeletonMessage />
							<SkeletonMessage />
							<SkeletonMessage />
						</div>
					) : (
						Object.entries(formattedMessages!).map(([key, { messages }]) => (
							<div key={key}>
								<div className='flex items-center justify-center py-8 text-foreground-300'>{key}</div>
								<div className='space-y-8'>
									{messages.map((message) => (
										<Message key={message.id} action={message} message={message} />
									))}
								</div>
							</div>
						))
					)}
				</div>
			</div>

			<Textarea
				header={
					(state?.type === 'reply' || state?.type === 'edit') && (
						<RepliedMessage {...state.message} className='mb-2' />
					)
				}
				isLoading={isLoadingMessages}
				value={message}
				onChange={(event) => dispatchContext({ type: ActionType.CHANGE_MESSAGE, payload: event.target.value })}
				onSend={handleSend}
			/>
		</div>
	);
}
