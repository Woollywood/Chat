import { slice } from './slice';

export { getMessages } from './actions';

export const { insertMessage } = slice.actions;
export const reducer = slice.reducer;
