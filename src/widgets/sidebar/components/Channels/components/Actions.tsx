import { useDispatch } from 'react-redux';
import { Popover, PopoverTrigger, PopoverContent } from '@nextui-org/popover';

import Action from './Action';

import { deleteChannelAction } from '@/stores/channels';
import { EllipsisIcon, DeleteIcon } from '@/components/icons';
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
		<Popover placement='right'>
			<PopoverTrigger onClick={onClick}>
				<button className='flex-shrink-0 rounded-lg p-1 transition-colors hover:bg-foreground hover:text-background'>
					<EllipsisIcon className='fill-foreground-300' height={16} width={16} />
				</button>
			</PopoverTrigger>
			<PopoverContent>
				<div className='flex flex-col gap-2'>
					<Action
						icon={<DeleteIcon className='fill-foreground-300' height={16} width={16} />}
						onClick={handleDelete}>
						Удалить
					</Action>
				</div>
			</PopoverContent>
		</Popover>
	);
}
