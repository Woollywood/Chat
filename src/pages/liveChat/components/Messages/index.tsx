import { useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { Skeleton } from '@nextui-org/skeleton';

import { useLiveChatDispatchContext } from '../../context';
import { ActionType } from '../../reducer';

import Actions from './components/Actions';
import { useMessages } from './hooks';
import { Textarea } from './components/controls';

import { RootState } from '@/store';
import { StoreMessage } from '@/stores/channelsMessages/types';
import { Message } from '@/components/messages';

function SkeletonMessage() {
	return (
		<Skeleton className='w-3/5 rounded-lg'>
			<div className='h-6 w-full rounded-lg bg-secondary' />
		</Skeleton>
	);
}

type FormattedMessage = Record<string, { messages: StoreMessage[] }>;
type MessageRef = {
	el: HTMLDivElement;
	replied: { id: number; el: HTMLDivElement } | null;
};

export default function Messages() {
	const messagesContainerRef = useRef<HTMLDivElement | null>(null);
	const messagesRef = useRef<Map<number, MessageRef>>(new Map());
	const textareaRef = useRef<HTMLTextAreaElement | null>(null);
	const { isLoading } = useMessages(messagesContainerRef);

	const dispatchContext = useLiveChatDispatchContext()!;

	useEffect(() => {
		dispatchContext({ type: ActionType.CHANGE_TEXTAREA_REF, payload: textareaRef.current });
	}, [textareaRef]);

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

	function handleClick(id: number) {
		const el = messagesRef.current.get(id);

		if (el?.replied) {
			const { replied } = el;

			replied.el.scrollIntoView({ behavior: 'instant', inline: 'nearest', block: 'start' });
		}
	}

	return (
		<div className='grid grid-rows-[1fr_auto] overflow-hidden'>
			<div ref={messagesContainerRef} className='scrollbar'>
				<div>
					{isLoading ? (
						<div className='space-y-6 p-4'>
							<SkeletonMessage />
							<SkeletonMessage />
							<SkeletonMessage />
						</div>
					) : (
						Object.entries(formattedMessages!).map(([key, { messages }]) => (
							<div key={key}>
								<div className='flex items-center justify-center px-4 py-8 text-foreground-300'>
									{key}
								</div>
								<div className='space-y-2 px-4'>
									{messages.map((message) => (
										<Message
											key={message.id}
											ref={(el) => {
												const rootEl = el!;
												const repliedMessage = message.repliedMessage;
												const replied = repliedMessage
													? {
															id: repliedMessage.id,
															el: messagesRef.current.get(repliedMessage.id)?.el!,
														}
													: null;

												messagesRef.current.set(message.id, {
													el: rootEl,
													replied,
												});
											}}
											{...message}
											actions={<Actions {...message} />}
											onClick={handleClick}
										/>
									))}
								</div>
							</div>
						))
					)}
				</div>
			</div>

			<Textarea ref={textareaRef} />
		</div>
	);
}
