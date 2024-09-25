import { configureStore } from '@reduxjs/toolkit';

import { reducer as sessionReducer } from '@/stores/session';
import { reducer as channelsReducer } from '@/stores/channels';
import { reducer as channelReducer } from '@/stores/channel';
import { reducer as channelsMessagesReducer } from '@/stores/channelsMessages';

export const store = configureStore({
	reducer: {
		session: sessionReducer,
		channels: channelsReducer,
		channel: channelReducer,
		channelsMessages: channelsMessagesReducer,
	},
	devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
