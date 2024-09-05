import { InitialState, ChannelState, MembersState } from '../context';

export enum ActionType {
	SET_CHANNEL = 1,
	SET_MEMBERS = 3,
}

export interface Action {
	type: ActionType;
	payload: ChannelState | MembersState;
}

export function reducer(state: InitialState, { type, payload }: Action): InitialState {
	switch (type) {
		case ActionType.SET_CHANNEL: {
			return { ...state, channel: payload as ChannelState };
		}
		case ActionType.SET_MEMBERS: {
			return { ...state, members: payload as MembersState };
		}
		default: {
			throw new Error('unknwon action type');
		}
	}
}
