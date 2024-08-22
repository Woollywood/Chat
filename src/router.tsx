import { useSelector } from 'react-redux';
import { Route, createBrowserRouter, createRoutesFromElements, Navigate, Outlet, useLocation } from 'react-router-dom';

import AppLayout from './layouts/AppLayout';

import { RootState } from '@/store';
import { Provider } from '@/provider';

export const router = createBrowserRouter(
	createRoutesFromElements(
		<Route
			element={
				<Provider>
					<AppLayout />
				</Provider>
			}>
			<Route lazy={() => import('@/pages/signin')} path='sign-in' />
			<Route lazy={() => import('@/pages/signup')} path='sign-up' />
			<Route element={<ProtectedRoute />}>
				<Route index lazy={() => import('@/pages/index')} />
				<Route lazy={() => import('@/pages/docs')} path='docs' />
				<Route lazy={() => import('@/pages/pricing')} path='pricing' />
				<Route lazy={() => import('@/pages/blog')} path='blog' />
				<Route lazy={() => import('@/pages/about')} path='about' />
				<Route lazy={() => import('@/pages/dashboard')} path='dashboard' />
				<Route lazy={() => import('@/pages/settings')} path='settings' />
				<Route lazy={() => import('@/pages/newProject')} path='new-project' />
				<Route lazy={() => import('@/pages/help')} path='help' />
				<Route lazy={() => import('@/pages/liveChat')} path='live-chat/:id' />
			</Route>
		</Route>,
	),
);

function ProtectedRoute() {
	const { session } = useSelector((state: RootState) => state.session);
	const location = useLocation();

	if (!session) {
		return <Navigate state={location} to='/sign-up' />;
	}

	return <Outlet />;
}
