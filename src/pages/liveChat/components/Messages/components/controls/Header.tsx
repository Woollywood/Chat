import { Header as UIHeader } from '@/components/controls/message';
import { useLiveChatContext, useLiveChatDispatchContext } from '@/pages/liveChat/context';
import { ActionType } from '@/pages/liveChat/reducer';

export default function Header() {
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
		(state?.type === 'reply' || state?.type === 'edit') && (
			<UIHeader {...state.message} className='mb-2' onClose={handleClose} />
		)
	);
}
