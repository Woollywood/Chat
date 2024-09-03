import { Skeleton } from '@nextui-org/skeleton';

import { useContextState } from '../../context';

import Members from './components/Members';

export default function Details() {
	const { channel: channelState } = useContextState();
	const { data: channel, isLoading: isChannelLoading } = channelState;

	return (
		<div className='grid grid-rows-[auto_auto_1fr] divide-y-1 divide-foreground-300 overflow-hidden'>
			<div className='flex h-28 items-center justify-center px-12 py-6'>
				<h2 className='text-2xl font-medium'>Detail Channels</h2>
			</div>
			<div className='px-6 py-12'>
				<h3 className='mb-4 text-xl font-semibold uppercase text-gray-500'>Name channel</h3>
				{isChannelLoading ? (
					<div className='h-auto'>
						<Skeleton className='flex h-6 w-full rounded-full' />
					</div>
				) : (
					<h2 className='pl-2 text-xl font-semibold'># {channel?.slug}</h2>
				)}
			</div>
			<Members />
		</div>
	);
}
