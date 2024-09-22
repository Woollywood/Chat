import { useSelector } from 'react-redux';
import { Skeleton } from '@nextui-org/skeleton';
import { NavLink } from 'react-router-dom';

import { useChannels } from '../../hooks';

import Actions from './components/Actions';

import { RootState } from '@/store';

export default function Channels() {
	const { channels } = useSelector((state: RootState) => state.channels);
	const { isChannelsLoading } = useChannels();

	return (
		<div className='space-y-2'>
			{isChannelsLoading ? (
				<>
					<Skeleton className='w-full rounded-lg'>
						<div className='h-6 w-full rounded-lg bg-default-200' />
					</Skeleton>
					<Skeleton className='w-full rounded-lg'>
						<div className='h-6 w-full rounded-lg bg-default-200' />
					</Skeleton>
					<Skeleton className='w-full rounded-lg'>
						<div className='h-6 w-full rounded-lg bg-default-200' />
					</Skeleton>
				</>
			) : channels?.length! > 0 ? (
				channels?.map((channel) => (
					<NavLink
						key={channel.id}
						className='flex items-center justify-between gap-4 whitespace-nowrap rounded-lg p-2 transition-colors hover:bg-foreground-100'
						to={`live-chat/${channel.id}`}>
						<h3 className='line-clamp-1 text-lg'># {channel.name}</h3>
						<Actions channelId={channel.id} />
					</NavLink>
				))
			) : (
				<p className='text-lg font-medium'>There is no channels</p>
			)}
		</div>
	);
}
