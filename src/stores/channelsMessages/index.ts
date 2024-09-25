import { slice } from './slice';

export {
	getMessages as getMessagesAction,
	deleteMessage as deleteMessageAction,
	editMessage as editMessageAction,
} from './actions';

export const { insertMessage, deleteMessage, updateMessage } = slice.actions;
export const reducer = slice.reducer;
