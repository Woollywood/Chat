import {
	RealtimeChannel,
	RealtimePostgresChangesPayload,
	RealtimePostgresDeletePayload,
	RealtimePostgresInsertPayload,
	RealtimePostgresUpdatePayload,
	REALTIME_POSTGRES_CHANGES_LISTEN_EVENT,
} from '@supabase/supabase-js';

import { supabase } from '@/supabase';
import { Database } from '@/types/supabase';

interface ChannelType {
	eventType: REALTIME_POSTGRES_CHANGES_LISTEN_EVENT;
	channel: RealtimeChannel;
}

class _WebSocketService {
	private mapChannels: Map<string, ChannelType[]> = new Map();

	constructor() {
		console.log('new websocket service');
	}

	subscribe<T extends { [key: string]: any }>({
		name,
		table,
	}: {
		name: string;
		table: keyof Database['public']['Tables'];
	}) {
		if (!this.mapChannels.has(name)) {
			this.mapChannels.set(name, []);
		}

		const withSubscription = <P>({
			eventType,
			handler,
		}: {
			eventType: REALTIME_POSTGRES_CHANGES_LISTEN_EVENT;
			handler: (channel: RealtimeChannel, callback: (payload: P) => void) => void;
		}) => {
			return (callback: (payload: P) => void) => {
				const mapChannel = this.mapChannels.get(name)!;

				if (mapChannel.find((channel) => channel.eventType === eventType)) {
					throw new Error(`The channel ${this.getChannelName({ name, eventType })} is already busy`);
				}

				const channel = supabase.channel(this.getChannelName({ name, eventType }));

				this.mapChannels.set(name, [...mapChannel, { eventType, channel }]);

				handler(channel, callback);
				channel.subscribe();

				console.log(`${this.getChannelName({ name, eventType })} on table ${table} subscribed`);
			};
		};

		const all = withSubscription<RealtimePostgresChangesPayload<T>>({
			eventType: REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.ALL,
			handler: (channel, callback) => {
				channel.on<T>('postgres_changes', { event: '*', schema: 'public', table }, (payload) => {
					callback(payload);
				});
			},
		});

		const insert = withSubscription<RealtimePostgresInsertPayload<T>>({
			eventType: REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.INSERT,
			handler: (channel, callback) => {
				channel.on<T>('postgres_changes', { event: 'INSERT', schema: 'public', table }, (payload) => {
					callback(payload);
				});
			},
		});

		const update = withSubscription<RealtimePostgresUpdatePayload<T>>({
			eventType: REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.UPDATE,
			handler: (channel, callback) => {
				channel.on<T>('postgres_changes', { event: 'UPDATE', schema: 'public', table }, (payload) => {
					callback(payload);
				});
			},
		});

		const del = withSubscription<RealtimePostgresDeletePayload<T>>({
			eventType: REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.DELETE,
			handler: (channel, callback) => {
				channel.on<T>('postgres_changes', { event: 'DELETE', schema: 'public', table }, (payload) => {
					callback(payload);
				});
			},
		});

		return { all, insert, update, del };
	}

	unsubscribe({ name, eventType }: { name: string; eventType: REALTIME_POSTGRES_CHANGES_LISTEN_EVENT }) {
		if (this.mapChannels.has(name)) {
			const mapChannel = this.mapChannels.get(name);
			const channel = mapChannel?.find((channel) => channel.eventType === eventType);

			if (channel) {
				channel.channel.unsubscribe();
				console.log(`${this.getChannelName({ name, eventType })} unsubscribed`);

				if (mapChannel?.length! > 1) {
					this.mapChannels.set(name, mapChannel?.filter((channel) => channel.eventType !== eventType)!);
				} else {
					this.mapChannels.delete(name);
				}
			}
		}
	}

	unsubscribeAll({ name }: { name: string }) {
		if (this.mapChannels.has(name)) {
			const mapChannel = this.mapChannels.get(name)!;

			for (const { channel, eventType } of mapChannel) {
				console.log(`${this.getChannelName({ name, eventType })} unsubscribed`);

				channel.unsubscribe();
			}

			this.mapChannels.delete(name);
		}
	}

	private getChannelName({ name, eventType }: { name: string; eventType: REALTIME_POSTGRES_CHANGES_LISTEN_EVENT }) {
		return `${name}_${eventType}`;
	}
}

export const WebSocketService = new _WebSocketService();
window.WebSocketService = WebSocketService;
