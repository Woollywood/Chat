import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';

import { RootState } from '@/store';

export function useAuthPrevent() {
	const navigate = useNavigate();
	const { session } = useSelector((state: RootState) => state.session);
	const { state } = useLocation();

	useEffect(() => {
		if (session) {
			navigate({ pathname: state?.pathname || '/' });
		}
	}, [session]);
}
