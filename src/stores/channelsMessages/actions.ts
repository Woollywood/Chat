import { createAsyncThunk } from '@reduxjs/toolkit';

import { MessagesApi } from '@/api/MessagesApi';

const typePrefix = '@@channels_messages';

export const getMessages = createAsyncThunk(`${typePrefix}/get`, async ({ channelId }: { channelId: number }) => {
	return await MessagesApi.getAll(channelId);
});
