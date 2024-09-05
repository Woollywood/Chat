import { Skeleton } from '@nextui-org/skeleton';
import { AvatarGroup } from '@nextui-org/avatar';

import { useContextState } from '../context';

import Avatar from '@/components/avatar';

export default function Header() {
	const { channel: channelState, members: membersState } = useContextState();
	const { data: channel, isLoading } = channelState;
	const { data: members } = membersState;

	const onlineCount = members?.filter((member) => member.profiles.user_activity.status === 'ONLINE').length;

	return (
		<div className='grid grid-rows-[auto_1fr] divide-y-1 divide-foreground-300'>
			{isLoading ? (
				<div className='flex h-28 flex-col justify-center gap-4 px-6 py-2 pb-4'>
					<div className='h-auto'>
						<Skeleton className='flex h-6 w-64 rounded-full' />
					</div>
					<div className='flex h-auto items-center gap-4'>
						<div className='flex items-center'>
							<Skeleton className='flex h-10 w-10 rounded-full' />
							<Skeleton className='-ml-2 flex h-10 w-10 rounded-full' />
							<Skeleton className='-ml-2 flex h-10 w-10 rounded-full' />
							<Skeleton className='-ml-2 flex h-10 w-10 rounded-full' />
						</div>
						<div className='flex items-center gap-2'>
							<Skeleton className='flex h-6 w-24 rounded-full' />
							<Skeleton className='flex h-6 w-12 rounded-full' />
						</div>
					</div>
				</div>
			) : (
				<div className='h-28 px-6 py-2 pb-4'>
					<div className='mb-4 text-xl font-semibold'># {channel?.slug}</div>
					<div className='flex items-center gap-4'>
						<AvatarGroup isBordered>
							{members?.map((member) => (
								<Avatar key={member.id} size='sm' src={member.profiles?.avatar_url!} />
							))}
						</AvatarGroup>
						<p className='text-foreground-700'>{members?.length} Members</p>
						<div className='h-1 w-1 flex-shrink-0 rounded-full bg-foreground-300' />
						<p className='text-green-500'>{onlineCount} Online</p>
					</div>
				</div>
			)}
			<div>Something</div>
		</div>
	);
}
