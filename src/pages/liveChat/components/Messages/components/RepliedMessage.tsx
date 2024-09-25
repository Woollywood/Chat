import { StoreMessage } from '@/stores/channelsMessages/types';
import { CloseIcon } from '@/components/icons';
import { useLiveChatContext, useLiveChatDispatchContext } from '@/pages/liveChat/context';
import { ActionType } from '@/pages/liveChat/reducer';

interface Props extends StoreMessage {
	className?: string;
}

export default function RepliedMessage({ profiles, text, className }: Props) {
	const { state } = useLiveChatContext()!;
	const dispatchContext = useLiveChatDispatchContext()!;

	function handleClose() {
		if (state?.type === 'edit') {
			dispatchContext({
				type: ActionType.CHANGE_MESSAGE,
				payload: '',
			});
		}

		dispatchContext({
			type: ActionType.RESET_STATE,
		});
	}

	return (
		<div className='flex justify-between'>
			<div className={className}>
				<div className='text-lg font-medium'>{profiles?.username}</div>
				<p className='text-wrap'>{text}</p>
			</div>
			<button className='p-1' onClick={handleClose}>
				<CloseIcon className='fill-foreground-500' height={16} width={16} />
			</button>
		</div>
	);
}
