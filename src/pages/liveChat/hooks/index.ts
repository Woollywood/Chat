import { useEffect } from 'react';
import { Location, Params } from 'react-router-dom';

import { useContextActions, useContextState, ChannelState } from '../context';
import { ActionType } from '../reducer';

import { ChannelApi } from '@/api/ChannelApi';

export function useChannel(location: Location, params: Readonly<Params<string>>) {
	const { channel: channelState } = useContextState();
	const { data, isLoading } = channelState;
	const dispatch = useContextActions()!;

	async function fetchChannel() {
		dispatch({ type: ActionType.SET_CHANNEL, payload: { isLoading: true, data: null } as unknown as ChannelState });
		const data = await ChannelApi.getFromId(params.id!);

		dispatch({ type: ActionType.SET_CHANNEL, payload: { isLoading: false, data } });
	}

	useEffect(() => {
		fetchChannel();
	}, [location]);

	return { isLoading, data };
}

export function useMembers(location: Location, params: Readonly<Params<string>>) {
	const { members: membersState } = useContextState();
	const { isLoading, data } = membersState;
	const dispatch = useContextActions()!;

	async function fetchChannelMembers() {
		dispatch({
			type: ActionType.SET_MEMBERS,
			payload: {
				isLoading: true,
				data: null,
			},
		});
		const data = await ChannelApi.getChannelMembers(params.id!);

		dispatch({
			type: ActionType.SET_MEMBERS,
			payload: {
				isLoading: false,
				// @ts-ignore
				data,
			},
		});
	}

	useEffect(() => {
		fetchChannelMembers();
	}, [location]);

	return { isLoading, data };
}
