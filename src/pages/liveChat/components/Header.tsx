import { Skeleton } from '@nextui-org/skeleton';
import { Avatar, AvatarGroup } from '@nextui-org/avatar';

import { useContextState } from '../context';

export default function Header() {
	const { channel: channelState, members: membersState } = useContextState();
	const { data: channel, isLoading } = channelState;
	const { data: members } = membersState;

	return (
		<div className='grid grid-rows-[auto_1fr] divide-y-1 divide-foreground-300'>
			{isLoading ? (
				<div className='flex h-28 flex-col justify-center gap-4 px-6 py-2 pb-4'>
					<div className='h-auto'>
						<Skeleton className='flex h-6 w-64 rounded-full' />
					</div>
					<AvatarGroup isBordered>
						<Avatar size='sm' />
						<Avatar size='sm' />
						<Avatar size='sm' />
						<Avatar size='sm' />
					</AvatarGroup>
				</div>
			) : (
				<div className='h-28 px-6 py-2 pb-4'>
					<div className='mb-4 text-xl font-semibold'># {channel?.slug}</div>
					<AvatarGroup isBordered>
						{members?.map((member) => (
							<Avatar key={member.id} size='sm' src={member.profiles?.avatar_url!} />
						))}
					</AvatarGroup>
				</div>
			)}
			<div>Something</div>
		</div>
	);
}
