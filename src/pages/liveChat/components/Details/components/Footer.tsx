import { useSelector, useDispatch } from 'react-redux';
import { Button } from '@nextui-org/button';
import { Skeleton } from '@nextui-org/skeleton';
import { useNavigate } from 'react-router-dom';

import { useLiveChatContext } from '@/pages/liveChat/context';
import { RootState, AppDispatch } from '@/store';
import { deleteChannelAction, leaveChannelAction } from '@/stores/channels';

export default function LeaveChat() {
	const navigate = useNavigate();
	const dispatch = useDispatch<AppDispatch>();
	const { isLoading } = useLiveChatContext();
	const { channel } = useSelector((state: RootState) => state.channel);
	const { session } = useSelector((state: RootState) => state.session);

	const isCreator = channel?.created_by === session?.user.id;

	if (isLoading) {
		return (
			<div className='flex items-center justify-center px-2 py-4'>
				<Skeleton className='flex h-10 w-full rounded-xl' />
			</div>
		);
	}

	async function handleLeave() {
		await dispatch(leaveChannelAction(channel?.id!));
		navigate('/');
	}

	async function handleDelete() {
		await dispatch(deleteChannelAction({ name: channel?.name! }));
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
