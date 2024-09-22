import { useSelector } from 'react-redux';

import Section from './components/Section';
import Channels from './components/Channels';
import AddNew from './components/AddNew';
import { useSocket } from './hooks';

import { RootState } from '@/store';
import Avatar from '@/components/avatar';

export default function Sidebar() {
	const { profile } = useSelector((state: RootState) => state.session);

	useSocket();

	return (
		<aside className='grid h-screen grid-rows-[auto_1fr]'>
			<div className='flex items-center gap-2 border-b border-b-foreground-300 p-6'>
				<Avatar src={profile?.avatar_url!} />
				<h3>{profile?.full_name}</h3>
			</div>
			<div className='scrollbar divide-y-1 divide-foreground-300 overflow-y-auto'>
				<Section actions={<AddNew />} title='Channels'>
					<Channels />
				</Section>
			</div>
		</aside>
	);
}
