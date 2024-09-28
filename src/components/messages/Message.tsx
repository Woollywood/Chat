import { forwardRef, ReactNode } from 'react';
import clsx from 'clsx';
import moment from 'moment';

import { StoreMessage } from '@/stores/channelsMessages/types';
import Avatar from '@/components/avatar';

interface Props extends StoreMessage {
	className?: string;
	actions?: ReactNode;
	onClick?: (id: number) => void;
}

const Message = forwardRef<HTMLButtonElement, Props>(
	({ id, created_at, profiles, text, className, actions, repliedMessage, onClick }, ref) => {
		function handleClick() {
			if (onClick) {
				onClick(id);
			}
		}

		return (
			<button
				ref={ref}
				className={clsx(
					'flex w-full cursor-pointer justify-between gap-4 rounded-lg p-2 transition-colors hover:bg-foreground-100',
					className,
				)}
				onClick={handleClick}>
				<Avatar src={profiles?.avatar_url!} storage='avatars' />
				<div>
					<div className='flex gap-6'>
						<div className='text-lg font-medium'>{profiles?.username}</div>
						<div className='self-start text-sm text-foreground-400'>{moment(created_at).format('LT')}</div>
					</div>
					{repliedMessage && (
						<div className='flex items-stretch gap-4 rounded-lg px-2 py-1 transition-colors before:w-[2px] before:bg-foreground-500 hover:bg-foreground-200'>
							<div>
								<p className='text-base'>{repliedMessage.profiles?.username}</p>
								<p className='text-sm'>{repliedMessage.text}</p>
							</div>
						</div>
					)}
					<p className='text-wrap text-sm'>{text}</p>
				</div>
				<div className='ml-auto'>{actions}</div>
			</button>
		);
	},
);

Message.displayName = 'Message';
export default Message;
