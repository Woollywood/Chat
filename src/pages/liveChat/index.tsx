import ContextProvider from './context';
import PageWrapper from './components/PageWrapper';

export function Component() {
	return (
		<ContextProvider>
			<PageWrapper />
		</ContextProvider>
	);
}
