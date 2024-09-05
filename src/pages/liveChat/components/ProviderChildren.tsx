import { useLocation, useParams } from 'react-router-dom';

import { useChannel, useMembers } from '../hooks';

import Details from './Details';
import Header from './Header';

export default function ProviderChildren() {
	const location = useLocation();
	const params = useParams();

	useChannel(location, params);
	useMembers(location, params);

	return (
		<div className='grid h-screen grid-cols-[1fr_auto] divide-x-1 divide-foreground-300'>
			<Header />
			<Details />
		</div>
	);
}
