import { ReactNode } from 'react';
import clsx from 'clsx';
import moment from 'moment';

import { StoreMessage } from '@/stores/channelsMessages/types';
import Avatar from '@/components/avatar';

interface Props extends StoreMessage {
	className?: string;
	actions?: ReactNode;
}

export default function Message({ created_at, profiles, text, className, actions }: Props) {
	return (
		<div className={clsx('flex justify-between gap-4', className)}>
			<Avatar src={profiles?.avatar_url!} storage='avatars' />
			<div>
				<div className='mb-1 flex items-center gap-6'>
					<div className='text-lg font-medium'>{profiles?.username}</div>
					<div className='text-sm text-foreground-400'>{moment(created_at).format('LT')}</div>
				</div>
				<p className='text-wrap'>{text}</p>
			</div>
			<div className='ml-auto'>{actions}</div>
		</div>
	);
}
