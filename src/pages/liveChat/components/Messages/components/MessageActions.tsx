import { useSelector, useDispatch } from 'react-redux';

import { useLiveChatDispatchContext } from '@/pages/liveChat/context';
import { ActionPopover, Action } from '@/components/popovers/action';
import { DeleteIcon, ReplyIcon } from '@/components/icons';
import { StoreMessage } from '@/stores/channelsMessages/types';
import { RootState, AppDispatch } from '@/store';
import { deleteMessageAction } from '@/stores/channelsMessages';
import { ActionType } from '@/pages/liveChat/reducer';

export default function MessageActions(message: StoreMessage) {
	const { id, user_id } = message;

	const dispatch = useDispatch<AppDispatch>();
	const dispatchContext = useLiveChatDispatchContext()!;
	const { profile } = useSelector((state: RootState) => state.session);

	async function handleDelete() {
		dispatch(deleteMessageAction({ id }));
	}

	function handleStartReply() {
		dispatchContext({
			type: ActionType.CHANGE_STATE,
			payload: {
				type: 'reply',
				message: message,
			},
		});
	}

	return (
		<ActionPopover
			actions={
				<>
					<Action
						icon={<ReplyIcon className='fill-foreground-300' height={16} width={16} />}
						onClick={handleStartReply}>
						Ответить
					</Action>
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
