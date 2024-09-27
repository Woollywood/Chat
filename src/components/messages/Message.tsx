import { ReactNode } from 'react';
import clsx from 'clsx';
import moment from 'moment';

import { StoreMessage } from '@/stores/channelsMessages/types';
import Avatar from '@/components/avatar';

interface Props extends StoreMessage {
	className?: string;
	actions?: ReactNode;
}

export default function Message({ created_at, profiles, text, className, actions, repliedMessage }: Props) {
	return (
		<div className={clsx('flex justify-between gap-4 p-4', className)}>
			<Avatar src={profiles?.avatar_url!} storage='avatars' />
			<div>
				<div className='mb-2 flex gap-6'>
					<div className='text-lg font-medium'>
						<p>{profiles?.username}</p>
						{repliedMessage && (
							<div className='flex items-stretch gap-4 pl-2 before:w-[2px] before:bg-foreground-500'>
								<div>
									<p className='text-base'>{repliedMessage.profiles?.username}</p>
									<p className='text-sm'>{repliedMessage.text}</p>
								</div>
							</div>
						)}
					</div>
					<div className='self-start text-sm text-foreground-400'>{moment(created_at).format('LT')}</div>
				</div>
				<p className='text-wrap'>{text}</p>
			</div>
			<div className='ml-auto'>{actions}</div>
		</div>
	);
}
