import { ChannelApi } from '@/api/ChannelApi';

export interface InitialState {
	isLoading: boolean;
	channel: Awaited<ReturnType<typeof ChannelApi.getFromId>>;
	members: Awaited<ReturnType<typeof ChannelApi.getChannelMembers>>;
}
