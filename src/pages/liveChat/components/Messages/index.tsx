import { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import { Textarea } from '@nextui-org/input';
import { Button } from '@nextui-org/button';
import { Spinner } from '@nextui-org/spinner';
import { Skeleton } from '@nextui-org/skeleton';

import { useMessages } from './hooks';

import Avatar from '@/components/avatar';
import { SendIcon } from '@/components/icons';
import { MessagesApi } from '@/api/MessagesApi';
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
	const [isLoadingMessages, setLoadingMessages] = useState(false);
	const messagesRef = useRef<HTMLDivElement | null>(null);
	const [message, setMessage] = useState('');

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

		if (trimmedMessage.length > 0) {
			setLoadingMessages(true);
			await MessagesApi.send(channelId, profile?.id!, message);
			setLoadingMessages(false);
			setMessage('');
		}
	}

	return (
		<div className='grid grid-rows-[1fr_auto] overflow-hidden'>
			<div ref={messagesRef} className='scrollbar'>
				<div className='px-6 py-4'>
					{isLoading ? (
						<>
							<SkeletonMessage />
							<SkeletonMessage />
							<SkeletonMessage />
						</>
					) : (
						Object.entries(formattedMessages!).map(([key, { messages }]) => (
							<div key={key}>
								<div className='flex items-center justify-center py-8 text-foreground-300'>{key}</div>
								<div className='space-y-8'>
									{messages.map((message) => (
										<div key={message.id} className='flex gap-4'>
											<Avatar src={message.profiles?.avatar_url!} storage='avatars' />
											<div>
												<div className='mb-1 flex items-center gap-6'>
													<div className='text-lg font-medium'>
														{message.profiles?.username}
													</div>
													<div className='text-sm text-foreground-400'>
														{moment(message.created_at).format('LT')}
													</div>
												</div>
												<p className='text-wrap'>{message.text}</p>
											</div>
										</div>
									))}
								</div>
							</div>
						))
					)}
				</div>
			</div>

			<div className='px-6 py-4'>
				<Textarea
					endContent={
						<Button
							isIconOnly
							aria-label='Send Message'
							className='self-end'
							color='primary'
							isLoading={isLoadingMessages}
							spinner={<Spinner color='white' size='sm' />}
							onClick={() => handleSend()}>
							<SendIcon height={24} width={24} />
						</Button>
					}
					placeholder='Enter your messsage'
					readOnly={isLoadingMessages}
					value={message}
					onChange={(event) => setMessage(event.target.value)}
				/>
			</div>
		</div>
	);
}
