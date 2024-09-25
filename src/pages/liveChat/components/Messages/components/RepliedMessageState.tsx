import { StoreMessage } from '@/stores/channelsMessages/types';
import { CloseIcon } from '@/components/icons';
import { useLiveChatDispatchContext } from '@/pages/liveChat/context';
import { ActionType } from '@/pages/liveChat/reducer';

interface Props extends StoreMessage {
	className?: string;
}

export default function RepliedMessageState({ profiles, text, className }: Props) {
	const dispatchContext = useLiveChatDispatchContext()!;

	function handleClose() {
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
