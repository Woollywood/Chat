import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { AppDispatch } from '@/store';
import { getChannels } from '@/stores/channels';

export function useChannels() {
	const dispatch = useDispatch<AppDispatch>();
	const [isChannelsLoading, setChannelsLoading] = useState(true);

	useEffect(() => {
		dispatch(getChannels()).then(() => setChannelsLoading(false));
	}, []);

	return { isChannelsLoading };
}
