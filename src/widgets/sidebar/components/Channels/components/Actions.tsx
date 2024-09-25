import { useDispatch } from 'react-redux';

import { ActionPopover, Action } from '@/components/popovers/action';
import { deleteChannelAction } from '@/stores/channels';
import { DeleteIcon } from '@/components/icons';
import { AppDispatch } from '@/store';

interface Props {
	channelId: number;
}

export default function Actions({ channelId }: Props) {
	const dispatch = useDispatch<AppDispatch>();

	function onClick(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
		event.preventDefault();
		event.stopPropagation();
	}

	function handleDelete(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
		onClick(event);
		dispatch(deleteChannelAction(channelId));
	}

	return (
		<ActionPopover
			actions={
				<Action
					icon={<DeleteIcon className='fill-foreground-300' height={16} width={16} />}
					onClick={handleDelete}>
					Удалить
				</Action>
			}
		/>
	);
}
