import ContextProvider from './context';
import ProviderChildren from './components/ProviderChildren';

export function Component() {
	return (
		<ContextProvider>
			<ProviderChildren />
		</ContextProvider>
	);
}
