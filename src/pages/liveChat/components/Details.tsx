import { Skeleton } from '@nextui-org/skeleton';
import { Badge } from '@nextui-org/badge';
import { Avatar } from '@nextui-org/avatar';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { useContextState, useContextActions } from '../context';
import { ActionType } from '../reducer';

import InviteModal from './InviteModal';
import UserSkeleton from './UserSkeleton';

import { DeleteIcon } from '@/components/icons';
import { supabase } from '@/supabase';
import { RootState } from '@/store';

export default function Details() {
	const params = useParams();

	const { session } = useSelector((state: RootState) => state.session);

	const { channel: channelState, members: membersState } = useContextState();
	const { data: channel, isLoading: isChannelLoading } = channelState;
	const { data: members, isLoading: isMembersLoading } = membersState;

	const isCreator = members?.find((member) => member.user_id === member.invited_by)?.user_id === session?.user.id;

	const dispatch = useContextActions()!;

	async function handleDelete(userId: string) {
		dispatch({
			type: ActionType.SET_MEMBERS,
			payload: {
				isLoading: true,
				data: members,
			},
		});
		const { data: deletedMember } = await supabase
			.from('channels_members')
			.delete()
			.eq('user_id', userId)
			.eq('channel_id', params.id!)
			.select('*, profiles!channels_members_user_id_fkey ( * )')
			.single();

		dispatch({
			type: ActionType.SET_MEMBERS,
			payload: {
				isLoading: false,
				// @ts-ignore
				data: members?.filter((member) => member.id !== deletedMember?.id),
			},
		});
	}

	async function inviteHandler(userId: string) {
		dispatch({
			type: ActionType.SET_MEMBERS,
			payload: {
				isLoading: true,
				data: members,
			},
		});

		const { data: invitedMember } = await supabase
			.from('channels_members')
			.insert([{ channel_id: channel?.id!, user_id: userId, invited_by: session?.user.id! }])
			.select('*, profiles!channels_members_user_id_fkey ( * )')
			.single();

		dispatch({
			type: ActionType.SET_MEMBERS,
			payload: {
				isLoading: false,
				// @ts-ignore
				data: members?.concat(invitedMember),
			},
		});
	}

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
			<div className='scrollbar overflow-y-auto px-6 py-12'>
				<div className='mb-4 flex items-center justify-between gap-2'>
					<h2 className='text-xl font-semibold uppercase text-gray-500'>Members</h2>
					<InviteModal
						className='ml-auto'
						existingUserIds={members?.map((member) => member.user_id)!}
						onInvite={inviteHandler}
					/>
				</div>
				<div className='space-y-2'>
					{isMembersLoading ? (
						<div className='space-y-2'>
							<UserSkeleton />
							<UserSkeleton />
							<UserSkeleton />
							<UserSkeleton />
						</div>
					) : (
						members?.map((member) => (
							<div key={member.id}>
								<div className='flex items-center gap-2'>
									{member.invited_by === member.user_id ? (
										<Badge color='primary' content='creator'>
											<div className='flex items-center gap-2'>
												<Avatar src={member.profiles?.avatar_url!} />
												<div className='flex flex-col justify-between'>
													<h4 className='text-md font-medium'>
														{member.profiles?.full_name}
													</h4>
													<p className='text-[0.75rem]'>{member.profiles?.status}</p>
												</div>
											</div>
										</Badge>
									) : (
										<>
											<Avatar src={member.profiles?.avatar_url!} />
											<div className='flex flex-col justify-between'>
												<h4 className='text-md font-medium'>{member.profiles?.full_name}</h4>
												<p className='text-[0.75rem]'>{member.profiles?.status}</p>
											</div>
										</>
									)}

									{member.user_id !== session?.user.id! &&
										(session?.user.id === member.invited_by || isCreator) && (
											<button
												className='ml-auto flex items-center justify-center rounded-lg p-1 transition-colors hover:bg-foreground hover:text-background'
												onClick={() => handleDelete(member.user_id)}>
												<DeleteIcon />
											</button>
										)}
								</div>
							</div>
						))
					)}
				</div>
			</div>
		</div>
	);
}
