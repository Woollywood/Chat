import { configureStore } from '@reduxjs/toolkit';

import { reducer as sessionReducer } from '@/stores/session';
import { reducer as channelsReducer } from '@/stores/channels';
import { reducer as channelReducer } from '@/stores/channel';

export const store = configureStore({
	reducer: {
		session: sessionReducer,
		channels: channelsReducer,
		channel: channelReducer,
	},
	devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
