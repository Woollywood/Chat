import { useEffect } from 'react';
import { Location, Params } from 'react-router-dom';

import { useContextActions, useContextState, ChannelState } from '../context';
import { ActionType } from '../reducer';

import { supabase } from '@/supabase';

export function useChannel(location: Location, params: Readonly<Params<string>>) {
	const { channel: channelState } = useContextState();
	const { data, isLoading } = channelState;
	const dispatch = useContextActions()!;

	async function fetchChannel() {
		dispatch({ type: ActionType.SET_CHANNEL, payload: { isLoading: true, data: null } as unknown as ChannelState });
		const { data } = await supabase.from('channels').select('*').eq('id', params.id!).single();

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
		const { data } = await supabase
			.from('channels_members')
			.select('*, profiles!channels_members_user_id_fkey ( *, user_activity!user_activity_user_id_fkey ( * ) )')
			.eq('channel_id', params.id!);

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
