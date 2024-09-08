import { useSelector, useDispatch } from 'react-redux';
import { Button } from '@nextui-org/button';
import { Skeleton } from '@nextui-org/skeleton';
import { useNavigate } from 'react-router-dom';

import { useContextState } from '../../../context';

import { ChannelApi } from '@/api/ChannelApi';
import { RootState, AppDispatch } from '@/store';
import { deleteChannel, leaveChannel } from '@/stores/channels';

export default function LeaveChat() {
	const navigate = useNavigate();
	const dispatch = useDispatch<AppDispatch>();

	const { channel: channelState } = useContextState();
	const { data: channel, isLoading: isChannelLoading } = channelState;

	const { session } = useSelector((state: RootState) => state.session);
	const isCreator = channel?.created_by === session?.user.id;

	if (isChannelLoading) {
		return (
			<div className='flex items-center justify-center px-2 py-4'>
				<Skeleton className='flex h-10 w-full rounded-xl' />
			</div>
		);
	}

	async function handleLeave() {
		await dispatch(leaveChannel(channel?.id!));
		navigate('/');
	}

	async function handleDelete() {
		await dispatch(deleteChannel({ name: channel?.slug! }));
		navigate('/');
	}

	return (
		<div className='flex items-center justify-center px-2 py-4'>
			{isCreator ? (
				<Button className='w-full' onClick={handleDelete}>
					Delete Channel
				</Button>
			) : (
				<Button className='w-full' onClick={handleLeave}>
					Leave channel
				</Button>
			)}
		</div>
	);
}
