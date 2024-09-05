import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import Section from './Section';
import Channels from './Channels';

import { Database } from '@/types/supabase';
import { RootState } from '@/store';
import { PlusIcon } from '@/components/icons';
import { ChannelApi } from '@/api/ChannelApi';
import Avatar from '@/components/avatar';

export default function Sidebar() {
	const { profile } = useSelector((state: RootState) => state.session);

	const [isChannelCreating, setChannelCreating] = useState(false);
	const [isChannelsLoading, setChannelsLoading] = useState(true);
	const [channels, setChannels] = useState<Database['public']['Tables']['channels']['Row'][] | null>(null);

	useEffect(() => {
		fetchChannels().then(() => setChannelsLoading(false));
	}, []);

	async function fetchChannels() {
		const data = await ChannelApi.getAll();

		setChannels(data);
	}

	function toggleChannelCreating() {
		setChannelCreating((prev) => !prev);
	}

	async function handleCreateChannel(channelName: string) {
		await ChannelApi.create(channelName, profile!);
		fetchChannels();
		toggleChannelCreating();
	}

	async function handleDeleteChannel(channelName: string) {
		await ChannelApi.delete(channelName);
		fetchChannels();
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
					<Channels
						channels={channels!}
						isCreating={isChannelCreating}
						isLoading={isChannelsLoading}
						onCreated={handleCreateChannel}
						onDeleted={handleDeleteChannel}
					/>
				</Section>
			</div>
		</aside>
	);
}
