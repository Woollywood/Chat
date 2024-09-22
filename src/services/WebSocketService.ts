import {
	RealtimeChannel,
	RealtimePostgresChangesPayload,
	RealtimePostgresDeletePayload,
	RealtimePostgresInsertPayload,
	RealtimePostgresUpdatePayload,
	REALTIME_POSTGRES_CHANGES_LISTEN_EVENT,
} from '@supabase/supabase-js';
import { isNil } from 'lodash-es';

import { supabase } from '@/supabase';
import { Database } from '@/types/supabase';

type ChannelType = {
	eventType: REALTIME_POSTGRES_CHANGES_LISTEN_EVENT;
	channel: RealtimeChannel;
};

class _WebSocketService {
	private mapChannels: Map<string, ChannelType[]> = new Map();

	subscribe<T extends { [key: string]: any }>({
		prefix,
		name,
		table,
		filter,
	}: {
		prefix?: string;
		name: string;
		table: keyof Database['public']['Tables'];
		filter?: string;
	}) {
		if (!this.mapChannels.has(this.getMapChannelName({ prefix, name }))) {
			this.mapChannels.set(this.getMapChannelName({ prefix, name }), []);
		}

		const withSubscription = <P>({
			eventType,
			handler,
			filter,
		}: {
			eventType: REALTIME_POSTGRES_CHANGES_LISTEN_EVENT;
			handler: ({
				channel,
				filter,
				callback,
			}: {
				channel: RealtimeChannel;
				filter?: string;
				callback: (payload: P) => void;
			}) => void;
			filter?: string;
		}) => {
			return (callback: (payload: P) => void) => {
				const mapChannel = this.mapChannels.get(this.getMapChannelName({ prefix, name }))!;

				if (mapChannel.find((channel) => channel.eventType === eventType)) {
					throw new Error(
						`The channel ${this.getMapChannelItemName({ name: this.getMapChannelName({ prefix, name }), eventType })} is already busy. Unsubscribe first`,
					);
				}

				const channel = supabase.channel(
					this.getMapChannelItemName({ name: this.getMapChannelName({ prefix, name }), eventType }),
				);

				this.mapChannels.set(this.getMapChannelName({ prefix, name }), [...mapChannel, { eventType, channel }]);

				handler({ channel, filter, callback });
				channel.subscribe();
			};
		};

		const all = withSubscription<RealtimePostgresChangesPayload<T>>({
			eventType: REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.ALL,
			filter,
			handler: ({ channel, filter, callback }) => {
				channel.on<T>('postgres_changes', { event: '*', schema: 'public', table, filter }, (payload) => {
					callback(payload);
				});
			},
		});

		const insert = withSubscription<RealtimePostgresInsertPayload<T>>({
			eventType: REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.INSERT,
			filter,
			handler: ({ channel, filter, callback }) => {
				channel.on<T>('postgres_changes', { event: 'INSERT', schema: 'public', table, filter }, (payload) => {
					callback(payload);
				});
			},
		});

		const update = withSubscription<RealtimePostgresUpdatePayload<T>>({
			eventType: REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.UPDATE,
			filter,
			handler: ({ channel, filter, callback }) => {
				channel.on<T>('postgres_changes', { event: 'UPDATE', schema: 'public', table, filter }, (payload) => {
					callback(payload);
				});
			},
		});

		const del = withSubscription<RealtimePostgresDeletePayload<T>>({
			eventType: REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.DELETE,
			filter,
			handler: ({ channel, filter, callback }) => {
				channel.on<T>('postgres_changes', { event: 'DELETE', schema: 'public', table, filter }, (payload) => {
					callback(payload);
				});
			},
		});

		return { all, insert, update, del };
	}

	unsubscribe({
		prefix,
		name,
		eventType,
	}: {
		prefix?: string;
		name: string;
		eventType: REALTIME_POSTGRES_CHANGES_LISTEN_EVENT;
	}) {
		if (this.mapChannels.has(this.getMapChannelName({ prefix, name }))) {
			const mapChannel = this.mapChannels.get(this.getMapChannelName({ prefix, name }));
			const channel = mapChannel?.find((channel) => channel.eventType === eventType);

			if (channel) {
				channel.channel.unsubscribe();

				if (mapChannel?.length! > 1) {
					this.mapChannels.set(
						this.getMapChannelName({ prefix, name }),
						mapChannel?.filter((channel) => channel.eventType !== eventType)!,
					);
				} else {
					this.mapChannels.delete(this.getMapChannelName({ prefix, name }));
				}
			}
		}
	}

	unsubscribeAll({ prefix, name }: { prefix?: string; name: string }) {
		if (this.mapChannels.has(this.getMapChannelName({ prefix, name }))) {
			const mapChannel = this.mapChannels.get(this.getMapChannelName({ prefix, name }))!;

			for (const { channel } of mapChannel) {
				channel.unsubscribe();
			}

			this.mapChannels.delete(this.getMapChannelName({ prefix, name }));
		}
	}

	private getMapChannelName({ prefix, name }: { prefix?: string; name: string }) {
		return isNil(prefix) ? name : `${prefix}_${name}`;
	}

	private getMapChannelItemName({
		name,
		eventType,
	}: {
		name: string;
		eventType: REALTIME_POSTGRES_CHANGES_LISTEN_EVENT;
	}) {
		return `${name}_${eventType}`;
	}
}

export const WebSocketService = new _WebSocketService();
