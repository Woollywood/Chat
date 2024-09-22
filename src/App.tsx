import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { Spinner } from '@nextui-org/spinner';

import { router } from './router';
import { UserActivityService } from './services/UserService';

import { useTheme } from '@/hooks/use-theme';
import { AppDispatch, RootState } from '@/store';
import { supabase } from '@/supabase';
import { resetSession, getUserProfileFromSession } from '@/stores/session';

function App() {
	useTheme();
	const { isComplete } = useSelector((state: RootState) => state.session);
	const dispatch = useDispatch<AppDispatch>();

	useEffect(() => {
		supabase.auth.onAuthStateChange((_event, session) => {
			if (session) {
				dispatch(getUserProfileFromSession(session));
				UserActivityService.init(session);
			} else {
				dispatch(resetSession());
			}
		});

		return () => {
			UserActivityService.destroy();
		};
	}, []);

	return (
		<>
			{isComplete ? (
				<RouterProvider router={router} />
			) : (
				<div className='flex h-screen w-full items-center justify-center'>
					<Spinner size='lg' />
				</div>
			)}
		</>
	);
}

export default App;
