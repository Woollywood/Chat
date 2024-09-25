import moment from 'moment';

import MessageActions from './MessageActions';

import Avatar from '@/components/avatar';
import { StoreMessage } from '@/stores/channelsMessages/types';

export default function Message(message: StoreMessage) {
	const { created_at, text, profiles } = message;

	return (
		<div className='flex gap-4'>
			<Avatar src={profiles?.avatar_url!} storage='avatars' />
			<div>
				<div className='mb-1 flex items-center gap-6'>
					<div className='text-lg font-medium'>{profiles?.username}</div>
					<div className='text-sm text-foreground-400'>{moment(created_at).format('LT')}</div>
				</div>
				<p className='text-wrap'>{text}</p>
			</div>
			<div className='ml-auto'>
				<MessageActions {...message} />
			</div>
		</div>
	);
}
