import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Location, Params } from 'react-router-dom';

import { getChannel } from '@/stores/channel';
import { AppDispatch } from '@/store';

export function useChannel(location: Location, params: Readonly<Params<string>>) {
	const [isLoading, setLoading] = useState(true);
	const dispatch = useDispatch<AppDispatch>();

	async function fetchChannel() {
		setLoading(true);
		await dispatch(getChannel({ id: params.id! }));
		setLoading(false);
	}

	useEffect(() => {
		fetchChannel();
	}, [location]);

	return { isLoading };
}
