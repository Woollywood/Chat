import { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Skeleton } from '@nextui-org/skeleton';
import { Avatar, AvatarGroup } from '@nextui-org/avatar';

import { PlusIcon } from '@/components/icons';
import { supabase } from '@/supabase';
import { Database } from '@/types/supabase';

type ChannelMemberBase = Database['public']['Tables']['channels_members']['Row'];
interface ChannelMember extends ChannelMemberBase {
	profiles: Database['public']['Tables']['profiles']['Row'] | null;
}

export function Component() {
	const [isLoadingChannel, setLoadingChannel] = useState(true);
	const [isLoadingMessages, setLoadingMessages] = useState(true);
	const [isLoadingChannelMembers, setLoadingChannelMembers] = useState(true);
	const [channel, setChannel] = useState<Database['public']['Tables']['channels']['Row'] | null>(null);
	const [messages, setMessages] = useState<Database['public']['Tables']['messages']['Row'][] | null>(null);
	const [channelMembers, setChannelMembers] = useState<ChannelMember[] | null>(null);
	const location = useLocation();
	const params = useParams();

	async function fetchChannelMembers() {
		const { data } = await supabase
			.from('channels_members')
			.select('*, profiles!channels_members_invited_by_fkey ( * )');

		setChannelMembers(data);
	}

	async function fetchChannel() {
		const { data } = await supabase.from('channels').select('*').eq('id', params.id!).single();

		setChannel(data);
	}

	async function fetchMessages() {
		const { data } = await supabase.from('messages').select('*, profiles ( * )').eq('channel_id', params.id!);

		setMessages(data);
	}

	useEffect(() => {
		fetchChannelMembers().finally(() => setLoadingChannelMembers(false));
	}, [location]);

	useEffect(() => {
		fetchChannel().finally(() => setLoadingChannel(false));
	}, [location]);

	useEffect(() => {
		fetchMessages().finally(() => setLoadingMessages(false));
	}, [location]);

	return (
		<section className='grid h-screen grid-cols-[1fr_auto] divide-x-1 divide-foreground-300'>
			<div className='grid grid-rows-[auto_1fr] divide-y-1 divide-foreground-300'>
				<div className='h-28 px-6 py-2 pb-4'>
					<div className='mb-4 text-xl font-semibold'># {channel?.slug}</div>
					<AvatarGroup isBordered>
						{channelMembers?.map((member) => (
							<Avatar key={member.id} src={member.profiles?.avatar_url!} size='sm' />
						))}
					</AvatarGroup>
				</div>
				<div></div>
			</div>
			<div className='divide-y-1 divide-foreground-300'>
				<div className='flex h-28 items-center justify-center px-12 py-6'>
					<h2 className='text-2xl font-medium'>Detail Channels</h2>
				</div>
				<div className='px-6 py-12'>
					<h3 className='mb-4 text-xl font-semibold uppercase text-gray-500'>Name channel</h3>
					<h2 className='pl-2 text-xl font-semibold'># {channel?.slug}</h2>
				</div>
				<div className='px-6 py-12'>
					<div className='mb-4 flex items-center justify-between gap-2'>
						<h2 className='text-xl font-semibold uppercase text-gray-500'>Member</h2>
						<button className='flex items-center justify-center rounded-lg p-1 transition-colors hover:bg-foreground hover:text-background'>
							<PlusIcon />
						</button>
					</div>
					<div className='space-y-2'>
						{channelMembers?.map((member) => (
							<div key={member.id}>
								<div className='flex items-center gap-2'>
									<Avatar src={member.profiles?.avatar_url!} />
									<div className='flex flex-col justify-between'>
										<h4 className='text-md font-medium'>{member.profiles?.full_name}</h4>
										<p className='text-[0.75rem]'>{member.profiles?.status}</p>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
