import { forwardRef } from 'react';

import { useControls } from '../../hooks';

import Header from './Header';

import { ActionType } from '@/pages/liveChat/reducer';
import { Textarea as UITextarea } from '@/components/controls/message';
import { useLiveChatContext, useLiveChatDispatchContext } from '@/pages/liveChat/context';

export const Textarea = forwardRef<HTMLTextAreaElement>((_, ref) => {
	const { isLoading, handleSend } = useControls();
	const { message } = useLiveChatContext()!;
	const dispatchContext = useLiveChatDispatchContext()!;

	return (
		<UITextarea
			ref={ref}
			header={<Header />}
			isLoading={isLoading}
			value={message}
			onChange={(event) => dispatchContext({ type: ActionType.CHANGE_MESSAGE, payload: event.target.value })}
			onSend={handleSend}
		/>
	);
});

Textarea.displayName = 'Textarea';
export default Textarea;
