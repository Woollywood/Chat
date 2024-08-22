import { Outlet } from 'react-router-dom';

import Sidebar from '@/widgets/sidebar';

export default function DefaultLayout() {
	return (
		<div className='relative grid h-screen grid-cols-[18rem_1fr]'>
			<Sidebar />
			<main className='container mx-auto max-w-7xl flex-grow px-6 pt-16'>
				<Outlet />
			</main>
		</div>
	);
}
