import { Outlet } from 'react-router-dom';

import { Navbar } from '@/components/navbar';

export default function DefaultLayout() {
	return (
		<div className='relative flex h-screen flex-col'>
			<Navbar />
			<main className='container mx-auto max-w-7xl flex-grow px-6 pt-16'>
				<Outlet />
			</main>
		</div>
	);
}
