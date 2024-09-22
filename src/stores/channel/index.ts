import { slice } from './slice';

export { getChannel, inviteUser, deleteUser, insertUserFromId } from './actions';

export const { updateMemberActivity, deleteMember } = slice.actions;
export const reducer = slice.reducer;
