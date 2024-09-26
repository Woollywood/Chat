import clsx from 'clsx';

import Actions from './Actions';

import { Message as UIMessage } from '@/components/messages';
import { StoreMessage } from '@/stores/channelsMessages/types';

interface Props {
	message: StoreMessage;
	className?: string;
}

export default function Message({ message, className }: Props) {
	const { repliedMessage } = message;

	return (
		<>
			{repliedMessage ? (
				<div className={clsx('space-y-2', className)}>
					<UIMessage {...message} actions={<Actions {...message} />} />
					<UIMessage className='pl-4' {...repliedMessage} />
				</div>
			) : (
				<UIMessage {...message} actions={<Actions {...message} />} />
			)}
		</>
	);
}
