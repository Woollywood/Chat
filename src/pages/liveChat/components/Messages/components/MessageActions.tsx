import { useSelector, useDispatch } from 'react-redux';

import { ActionPopover, Action } from '@/components/popovers/action';
import { DeleteIcon } from '@/components/icons';
import { StoreMessage } from '@/stores/channelsMessages/types';
import { RootState, AppDispatch } from '@/store';
import { deleteMessageAction } from '@/stores/channelsMessages';

export default function MessageActions({ id, user_id }: StoreMessage) {
	const dispatch = useDispatch<AppDispatch>();
	const { profile } = useSelector((state: RootState) => state.session);

	async function handleDelete() {
		dispatch(deleteMessageAction({ id }));
	}

	return (
		<ActionPopover
			actions={
				<>
					{profile?.id === user_id && (
						<Action
							icon={<DeleteIcon className='fill-foreground-300' height={16} width={16} />}
							onClick={handleDelete}>
							Удалить
						</Action>
					)}
				</>
			}
		/>
	);
}
