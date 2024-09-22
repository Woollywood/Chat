import Details from './components/Details';
import Header from './components/Header';
import ContextProvider from './context';

export function Component() {
	return (
		<ContextProvider>
			<div className='grid h-screen grid-cols-[1fr_auto] divide-x-1 divide-foreground-300'>
				<Header />
				<Details />
			</div>
		</ContextProvider>
	);
}
