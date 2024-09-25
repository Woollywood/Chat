import { createContext, useContext, useReducer, ReactNode, Dispatch } from 'react';

import { Action, reducer } from '../reducer';

import { StoreMessage } from '@/stores/channelsMessages/types';

export interface InitialState {
	isLoading: boolean;
	state: {
		type: 'reply';
		message: StoreMessage;
	} | null;
}

const InitialState: InitialState = {
	isLoading: true,
	state: null,
};

const LiveChatContext = createContext<InitialState | null>(null);
const LiveChatDispatchContext = createContext<Dispatch<Action> | null>(null);

interface Props {
	children: ReactNode;
}

export function useLiveChatContext() {
	return useContext(LiveChatContext);
}

export function useLiveChatDispatchContext() {
	return useContext(LiveChatDispatchContext);
}

export default function ContextProvider({ children }: Props) {
	const [value, dispatch] = useReducer(reducer, { isLoading: true, state: null });

	return (
		<LiveChatContext.Provider value={value}>
			<LiveChatDispatchContext.Provider value={dispatch}>{children}</LiveChatDispatchContext.Provider>
		</LiveChatContext.Provider>
	);
}
