import { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { Textarea } from '@nextui-org/input';
import { Button } from '@nextui-org/button';
import { Spinner } from '@nextui-org/spinner';

import { useMessages } from './hooks';

import { SendIcon } from '@/components/icons';
import Avatar from '@/components/avatar';
import { MessagesApi } from '@/api/MessagesApi';
import { RootState } from '@/store';

export default function Messages() {
	const [message, setMessage] = useState('');

	const messagesRef = useRef<HTMLDivElement | null>(null);
	const [isLoading, setLoading] = useState(false);

	const { messages } = useSelector((state: RootState) => state.channelsMessages);
	const { channel } = useSelector((state: RootState) => state.channel);
	const { profile } = useSelector((state: RootState) => state.session);

	useMessages(channel?.id!, messagesRef);

	async function handleSend() {
		const trimmedMessage = message.trim();

		if (trimmedMessage.length > 0) {
			setLoading(true);
			await MessagesApi.send(channel?.id!, profile?.id!, message);
			setLoading(false);
			setMessage('');
		}
	}

	return (
		<div className='grid grid-rows-[1fr_auto] overflow-hidden'>
			<div ref={messagesRef} className='scrollbar'>
				<div className='space-y-6 px-6 py-4'>
					{messages?.map((message) => (
						<div key={message.id} className='flex gap-4'>
							<Avatar src={message.profiles?.avatar_url!} storage='avatars' />
							<div>
								<div className='mb-1 flex items-center gap-6'>
									<div className='text-lg font-medium'>{message.profiles?.username}</div>
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

			<div className='px-6 py-4'>
				<Textarea
					endContent={
						<Button
							isIconOnly
							aria-label='Send Message'
							className='self-end'
							color='primary'
							isLoading={isLoading}
							spinner={<Spinner color='white' size='sm' />}
							onClick={() => handleSend()}>
							<SendIcon height={24} width={24} />
						</Button>
					}
					placeholder='Enter your messsage'
					readOnly={isLoading}
					value={message}
					onChange={(event) => setMessage(event.target.value)}
				/>
			</div>
		</div>
	);
}
