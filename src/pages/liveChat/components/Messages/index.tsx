import { useRef } from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { Skeleton } from '@nextui-org/skeleton';

import { useMessages } from './hooks';
import Message from './components/Message';
import { Textarea } from './components/controls';

import { RootState } from '@/store';
import { StoreMessage } from '@/stores/channelsMessages/types';

function SkeletonMessage() {
	return (
		<Skeleton className='w-3/5 rounded-lg'>
			<div className='h-6 w-full rounded-lg bg-secondary' />
		</Skeleton>
	);
}

type FormattedMessage = Record<string, { messages: StoreMessage[] }>;

export default function Messages() {
	const messagesRef = useRef<HTMLDivElement | null>(null);
	const { isLoading } = useMessages(messagesRef);

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

			<Textarea />
		</div>
	);
}
