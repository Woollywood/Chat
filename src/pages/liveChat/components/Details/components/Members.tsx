import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { RealtimePostgresUpdatePayload } from '@supabase/supabase-js';

import InviteModal from '../../InviteModal';
import UserSkeleton from '../../UserSkeleton';

import MemberList from './MemberList';

import Section from '@/components/Section';
import { useLiveChatContext } from '@/pages/liveChat/context';
import { updateMemberActivity, deleteUser, inviteUser } from '@/stores/channel';
import { RootState, AppDispatch } from '@/store';
import { Database } from '@/types/supabase';
import { WebSocketService } from '@/services/WebSocketService';

export default function Members() {
	const params = useParams();
	const dispatch = useDispatch<AppDispatch>();
	const { session } = useSelector((state: RootState) => state.session);
	const { channel, members } = useSelector((state: RootState) => state.channel);
	const { isLoading } = useLiveChatContext()!;

	function updateMembers(
		payload: RealtimePostgresUpdatePayload<Database['public']['Tables']['user_activity']['Row']>,
	) {
		if (payload.new) {
			dispatch(updateMemberActivity(payload.new));
		}
	}

	useEffect(() => {
		WebSocketService.subscribe<Database['public']['Tables']['user_activity']['Row']>({
			name: 'live-chat-user-activity',
			table: 'user_activity',
		}).update((payload) => {
			updateMembers(payload);
		});

		return () => {
			WebSocketService.unsubscribeAll({
				name: 'live-chat-user-activity',
			});
		};
	}, [updateMembers]);

	async function handleDelete(userId: string) {
		dispatch(deleteUser({ userId, channelId: params.id! }));
	}

	async function inviteHandler(userId: string) {
		dispatch(inviteUser({ channel: channel!, userId, session: session! }));
	}

	return (
		<Section
			actions={
				<InviteModal
					className='ml-auto'
					existingUserIds={members?.map((member) => member.user_id)!}
					onInvite={inviteHandler}
				/>
			}
			className='scrollbar'
			title='Members'>
			<div className='space-y-2'>
				{isLoading ? (
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
		</Section>
	);
}
