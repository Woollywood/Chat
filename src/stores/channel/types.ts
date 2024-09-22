import { ChannelApi } from '@/api/ChannelApi';

export interface InitialState {
	channel: Awaited<ReturnType<typeof ChannelApi.getFromId>>;
	members: Awaited<ReturnType<typeof ChannelApi.getChannelMembers>>;
}
