import { slice } from './slice';

export {
	getChannels as getChannelsAction,
	getChannel as getChannelAction,
	createChannel as createChannelAction,
	deleteChannel as deleteChannelAction,
	leaveChannel as leaveChannelAction,
} from './actions';

export type { StoreChannel } from './types';

export const { deleteChannel, insertMember, deleteMember } = slice.actions;
export const reducer = slice.reducer;
