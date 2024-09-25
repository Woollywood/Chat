import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';

import { ActionType } from '../reducer';
import { useLiveChatDispatchContext } from '../context';

import { getChannel } from '@/stores/channel';
import { AppDispatch } from '@/store';

export function useChannel() {
	const location = useLocation();
	const params = useParams();

	const dispatch = useDispatch<AppDispatch>();
	const dispatchContext = useLiveChatDispatchContext()!;

	async function fetchChannel() {
		dispatchContext({ type: ActionType.CHANGE_LOADING, payload: true });
		await dispatch(getChannel({ id: params.id! }));
		dispatchContext({ type: ActionType.CHANGE_LOADING, payload: false });
	}

	useEffect(() => {
		fetchChannel();
	}, [location.pathname]);
}
