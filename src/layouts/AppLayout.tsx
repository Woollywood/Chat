import { useSelector } from 'react-redux';

import DefaultLayout from './default';
import UnauthorizedLayout from './unauthorized';

import { RootState } from '@/store';

export default function AppLayout() {
	const { session } = useSelector((state: RootState) => state.session);

	return <>{session ? <DefaultLayout /> : <UnauthorizedLayout />}</>;
}
