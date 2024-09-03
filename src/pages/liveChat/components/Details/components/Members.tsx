import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import InviteModal from '../../InviteModal';
import UserSkeleton from '../../UserSkeleton';
import { ActionType } from '../../../reducer';
import { useContextState, useContextActions } from '../../../context';

import MemberList from './MemberList';

import { supabase } from '@/supabase';
import { RootState } from '@/store';

export default function Members() {
	const params = useParams();

	const { session } = useSelector((state: RootState) => state.session);
	const { channel: channelState, members: membersState } = useContextState();
	const { data: channel } = channelState;
	const { data: members, isLoading: isMembersLoading } = membersState;

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
					<MemberList members={members!} onDelete={handleDelete} />
				)}
			</div>
		</div>
	);
}
