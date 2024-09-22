import { slice } from './slice';

export { getUserProfileFromSession } from './actions';

export const { resetSession } = slice.actions;
export const reducer = slice.reducer;
