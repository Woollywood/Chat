import { useState } from 'react';
import { useSelector } from 'react-redux';

import Section from './components/Section';
import Channels from './components/Channels';
import { useSocket } from './hooks';

import { RootState } from '@/store';
import { PlusIcon } from '@/components/icons';
import Avatar from '@/components/avatar';

export default function Sidebar() {
	const { profile } = useSelector((state: RootState) => state.session);
	const [isChannelCreating, setChannelCreating] = useState(false);

	useSocket();

	function toggleChannelCreating() {
		setChannelCreating((prev) => !prev);
	}

	async function handleCreateChannel() {
		toggleChannelCreating();
	}

	return (
		<aside className='grid h-screen grid-rows-[auto_1fr]'>
			<div className='flex items-center gap-2 border-b border-b-foreground-300 p-6'>
				<Avatar src={profile?.avatar_url!} />
				<h3>{profile?.full_name}</h3>
			</div>
			<div className='scrollbar divide-y-1 divide-foreground-300 overflow-y-auto'>
				<Section
					actions={
						<button
							className='rounded-lg p-1 transition-colors hover:bg-foreground hover:text-background'
							onClick={toggleChannelCreating}>
							<PlusIcon height={16} width={16} />
						</button>
					}
					title='Channels'>
					<Channels isCreating={isChannelCreating} onCreated={handleCreateChannel} />
				</Section>
			</div>
		</aside>
	);
}
