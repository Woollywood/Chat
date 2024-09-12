import { createContext, useContext, ReactNode } from 'react';
import { useLocation, useParams } from 'react-router-dom';

import { useChannel } from '../hooks';

interface InitialState {
	isLoading: boolean;
}

const InitialState: InitialState = {
	isLoading: true,
};

const LiveChatContext = createContext<InitialState>(InitialState);

interface Props {
	children: ReactNode;
}

export function useLiveChatContext() {
	return useContext(LiveChatContext);
}

export default function ContextProvider({ children }: Props) {
	const location = useLocation();
	const params = useParams();

	const value = useChannel(location, params);

	return <LiveChatContext.Provider value={value}>{children}</LiveChatContext.Provider>;
}
