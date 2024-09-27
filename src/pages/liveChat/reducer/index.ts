import { InitialState } from '../context';

export enum ActionType {
	CHANGE_STATE = 1,
	CHANGE_LOADING,
	RESET_STATE,
	CHANGE_MESSAGE,
	CHANGE_TEXTAREA_REF,
}

export interface Action {
	type: ActionType;
	payload?: InitialState['state'] | InitialState['isLoading'] | InitialState['message'] | InitialState['textareaRef'];
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
		case ActionType.CHANGE_MESSAGE: {
			return { ...state, message: payload as InitialState['message'] };
		}
		case ActionType.CHANGE_TEXTAREA_REF:
			return { ...state, textareaRef: payload as InitialState['textareaRef'] };
		default:
			throw new Error('unknown action type');
	}
}
