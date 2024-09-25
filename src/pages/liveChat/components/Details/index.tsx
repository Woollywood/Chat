import { useSelector } from 'react-redux';
import { Skeleton } from '@nextui-org/skeleton';

import { useLiveChatContext } from '../../context';

import Members from './components/Members';
import Footer from './components/Footer';

import Section from '@/components/Section';
import { RootState } from '@/store';

export default function Details() {
	const { isLoading } = useLiveChatContext()!;
	const { channel } = useSelector((state: RootState) => state.channel);

	return (
		<div className='grid grid-rows-[auto_auto_1fr_auto] divide-y-1 divide-foreground-300 overflow-hidden'>
			<div className='flex h-28 items-center justify-center px-12 py-6'>
				<h2 className='text-2xl font-medium'>Detail Channels</h2>
			</div>
			<div>
				<Section title='Name channel'>
					{isLoading ? (
						<div className='h-auto'>
							<Skeleton className='flex h-6 w-full rounded-full' />
						</div>
					) : (
						<h2 className='pl-2 text-xl font-semibold'># {channel?.name}</h2>
					)}
				</Section>
				{channel?.description.length! > 0 && (
					<Section title='About'>
						{isLoading ? (
							<div className='h-auto'>
								<Skeleton className='flex h-6 w-full rounded-full' />
							</div>
						) : (
							<h2 className='pl-2 text-base'>{channel?.description}</h2>
						)}
					</Section>
				)}
			</div>
			<Members />
			<Footer />
		</div>
	);
}
