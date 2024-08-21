import { configureStore } from '@reduxjs/toolkit';

import { reducer as sessionReducer } from '@/stores/session';

export const store = configureStore({
	reducer: {
		session: sessionReducer,
	},
	devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
