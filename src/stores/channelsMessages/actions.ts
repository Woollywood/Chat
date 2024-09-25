import { createAsyncThunk } from '@reduxjs/toolkit';

import { MessagesApi } from '@/api/MessagesApi';

const typePrefix = '@@channels_messages';

export const getMessages = createAsyncThunk(`${typePrefix}/get`, async ({ channelId }: { channelId: number }) => {
	return await MessagesApi.getAll(channelId);
});

export const deleteMessage = createAsyncThunk(`${typePrefix}/delete`, async ({ id }: { id: number }) => {
	return await MessagesApi.del(id);
});

export const editMessage = createAsyncThunk(
	`${typePrefix}/edit`,
	async ({ id, text }: { id: number; text: string }) => {
		return await MessagesApi.edit(id, text);
	},
);
