import { slice } from './slice';

export { getMessages as getMessagesAction, deleteMessage as deleteMessageAction } from './actions';

export const { insertMessage, deleteMessage } = slice.actions;
export const reducer = slice.reducer;
