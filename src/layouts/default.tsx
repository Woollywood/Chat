import { Outlet } from 'react-router-dom';

import Sidebar from '@/widgets/sidebar';

export default function DefaultLayout() {
	return (
		<div className='relative grid h-screen grid-cols-[18rem_1fr] divide-x-1 divide-foreground-300'>
			<Sidebar />
			<main>
				<Outlet />
			</main>
		</div>
	);
}
