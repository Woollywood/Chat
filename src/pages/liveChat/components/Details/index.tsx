import { useSelector } from 'react-redux';
import { Skeleton } from '@nextui-org/skeleton';

import { useLiveChatContext } from '../../context';

import Members from './components/Members';
import Footer from './components/Footer';

import { RootState } from '@/store';

export default function Details() {
	const { isLoading } = useLiveChatContext();
	const { channel } = useSelector((state: RootState) => state.channel);

	return (
		<div className='grid grid-rows-[auto_auto_1fr_auto] divide-y-1 divide-foreground-300 overflow-hidden'>
			<div className='flex h-28 items-center justify-center px-12 py-6'>
				<h2 className='text-2xl font-medium'>Detail Channels</h2>
			</div>
			<div className='px-6 py-12'>
				<h3 className='mb-4 text-xl font-semibold uppercase text-gray-500'>Name channel</h3>
				{isLoading ? (
					<div className='h-auto'>
						<Skeleton className='flex h-6 w-full rounded-full' />
					</div>
				) : (
					<h2 className='pl-2 text-xl font-semibold'># {channel?.name}</h2>
				)}
			</div>
			<Members />
			<Footer />
		</div>
	);
}
