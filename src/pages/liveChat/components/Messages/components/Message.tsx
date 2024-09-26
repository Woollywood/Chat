import moment from 'moment';
import clsx from 'clsx';

import Actions from './Actions';

import Avatar from '@/components/avatar';
import { StoreMessage } from '@/stores/channelsMessages/types';

interface Props {
	message: StoreMessage;
	action?: StoreMessage;
	className?: string;
}

export default function Message({ message, action, className }: Props) {
	const { created_at, text, profiles, repliedMessage } = message;

	return (
		<>
			{repliedMessage ? (
				<div className={clsx('space-y-2', className)}>
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
							<Actions {...action!} />
						</div>
					</div>
					<Message className='pl-4' message={repliedMessage!} />
				</div>
			) : (
				<div className={clsx('flex gap-4', className)}>
					<Avatar src={profiles?.avatar_url!} storage='avatars' />
					<div>
						<div className='mb-1 flex items-center gap-6'>
							<div className='text-lg font-medium'>{profiles?.username}</div>
							<div className='text-sm text-foreground-400'>{moment(created_at).format('LT')}</div>
						</div>
						<p className='text-wrap'>{text}</p>
					</div>
					{action && (
						<div className='ml-auto'>
							<Actions {...action!} />
						</div>
					)}
				</div>
			)}
		</>
	);
}
