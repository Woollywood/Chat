import { useReducer, useContext, createContext, ReactNode, Dispatch } from 'react';

import { reducer, Action } from '../reducer';

import { Database } from '@/types/supabase';

type BaseField = {
	isLoading: boolean;
};

export interface ChannelState extends BaseField {
	data: Database['public']['Tables']['channels']['Row'] | null;
}

export interface MembersState extends BaseField {
	data:
		| (Database['public']['Tables']['channels_members']['Row'] & {
				profiles: Database['public']['Tables']['profiles']['Row'] & {
					user_activity: Database['public']['Tables']['user_activity']['Row'];
				};
		  })[]
		| null;
}

export interface MessagesState extends BaseField {
	data: Database['public']['Tables']['messages']['Row'][] | null;
}

export interface InitialState {
	channel: ChannelState;
	members: MembersState;
	messages: MessagesState;
}

interface ContextActions extends Dispatch<Action> {}

const initialState: InitialState = {
	channel: {
		data: null,
		isLoading: true,
	},
	members: {
		data: null,
		isLoading: true,
	},
	messages: {
		data: null,
		isLoading: true,
	},
};

const ContextState = createContext<InitialState>(initialState);
const ContextActions = createContext<ContextActions | undefined>(undefined);

interface Props {
	children: ReactNode;
}

export function useContextState() {
	return useContext(ContextState);
}

export function useContextActions() {
	return useContext(ContextActions);
}

export default function ContextProvider({ children }: Props) {
	const [state, dispatch] = useReducer(reducer, initialState);

	return (
		<ContextState.Provider value={state}>
			<ContextActions.Provider value={dispatch}>{children}</ContextActions.Provider>
		</ContextState.Provider>
	);
}
