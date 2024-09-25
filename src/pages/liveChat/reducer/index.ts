import { InitialState } from '../context';

export enum ActionType {
	CHANGE_STATE = 1,
	CHANGE_LOADING,
	RESET_STATE,
}

export interface Action {
	type: ActionType;
	payload?: InitialState['state'] | InitialState['isLoading'];
}

export function reducer(state: InitialState, { type, payload }: Action): InitialState {
	switch (type) {
		case ActionType.CHANGE_STATE: {
			return {
				...state,
				state: payload as InitialState['state'],
			};
		}
		case ActionType.CHANGE_LOADING: {
			return {
				...state,
				isLoading: payload as InitialState['isLoading'],
			};
		}
		case ActionType.RESET_STATE: {
			return {
				...state,
				state: null,
			};
		}
		default:
			throw new Error('unknown action type');
	}
}
