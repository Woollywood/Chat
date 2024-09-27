import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { useLiveChatContext, useLiveChatDispatchContext } from '@/pages/liveChat/context';
import { ActionPopover, Action } from '@/components/popovers/action';
import { DeleteIcon, ReplyIcon, EditIcon } from '@/components/icons';
import { StoreMessage } from '@/stores/channelsMessages/types';
import { RootState, AppDispatch } from '@/store';
import { deleteMessageAction } from '@/stores/channelsMessages';
import { ActionType } from '@/pages/liveChat/reducer';

export default function Actions(message: StoreMessage) {
	const [isOpen, setOpen] = useState(false);

	const { id, user_id } = message;
	const { textareaRef } = useLiveChatContext()!;

	const dispatch = useDispatch<AppDispatch>();
	const dispatchContext = useLiveChatDispatchContext()!;
	const { profile } = useSelector((state: RootState) => state.session);

	async function handleDelete() {
		dispatch(deleteMessageAction({ id }));
	}

	function handleReply() {
		dispatchContext({
			type: ActionType.CHANGE_STATE,
			payload: {
				type: 'reply',
				message: message,
			},
		});
	}

	function handleEdit() {
		dispatchContext({
			type: ActionType.CHANGE_STATE,
			payload: {
				type: 'edit',
				message: message,
			},
		});
		dispatchContext({
			type: ActionType.CHANGE_MESSAGE,
			payload: message.text,
		});
	}

	function handleClick(type: 'delete' | 'reply' | 'edit') {
		textareaRef?.focus();
		setOpen(false);

		switch (type) {
			case 'delete':
				handleDelete();
				break;
			case 'reply':
				handleReply();
				break;
			case 'edit':
				handleEdit();
				break;
		}
	}

	return (
		<ActionPopover isOpen={isOpen} onOpenChange={setOpen}>
			<>
				<Action
					icon={<ReplyIcon className='fill-foreground-300' height={16} width={16} />}
					onClick={() => handleClick('reply')}>
					Ответить
				</Action>
				{profile?.id === user_id && (
					<>
						<Action
							icon={<EditIcon className='fill-foreground-300' height={16} width={16} />}
							onClick={() => handleClick('edit')}>
							Редактировать
						</Action>
						<Action
							icon={<DeleteIcon className='fill-foreground-300' height={16} width={16} />}
							onClick={() => handleClick('delete')}>
							Удалить
						</Action>
					</>
				)}
			</>
		</ActionPopover>
	);
}
