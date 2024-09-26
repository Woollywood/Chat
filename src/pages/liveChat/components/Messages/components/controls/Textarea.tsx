import { useControls } from '../../hooks';

import Header from './Header';

import { ActionType } from '@/pages/liveChat/reducer';
import { Textarea as UITextarea } from '@/components/controls/message';
import { useLiveChatContext, useLiveChatDispatchContext } from '@/pages/liveChat/context';

export default function Textarea() {
	const { isLoading, handleSend } = useControls();
	const { message } = useLiveChatContext()!;
	const dispatchContext = useLiveChatDispatchContext()!;

	return (
		<UITextarea
			header={<Header />}
			isLoading={isLoading}
			value={message}
			onChange={(event) => dispatchContext({ type: ActionType.CHANGE_MESSAGE, payload: event.target.value })}
			onSend={handleSend}
		/>
	);
}
