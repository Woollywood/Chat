import { Outlet } from 'react-router-dom';

export default function UnauthorizedLayout() {
	return (
		<div className='relative h-screen'>
			<main className='container mx-auto max-w-7xl flex-grow px-6 pt-16'>
				<Outlet />
			</main>
		</div>
	);
}
