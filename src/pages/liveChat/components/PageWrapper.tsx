import { useChannel } from '../hooks';

import Details from './Details';
import Header from './Header';
import Messages from './Messages';

export default function PageWrapper() {
	useChannel();

	return (
		<div className='grid h-screen grid-cols-[1fr_auto] divide-x-1 divide-foreground-300'>
			<div className='grid grid-rows-[auto_1fr] divide-y-1 divide-foreground-300 overflow-hidden'>
				<Header />
				<Messages />
			</div>
			<Details />
		</div>
	);
}
