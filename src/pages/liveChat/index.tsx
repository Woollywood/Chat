import Details from './components/Details';
import Header from './components/Header';
import Messages from './components/Messages';
import ContextProvider from './context';

export function Component() {
	return (
		<ContextProvider>
			<div className='grid h-screen grid-cols-[1fr_auto] divide-x-1 divide-foreground-300'>
				<div className='grid grid-rows-[auto_1fr] divide-y-1 divide-foreground-300 overflow-hidden'>
					<Header />
					<Messages />
				</div>
				<Details />
			</div>
		</ContextProvider>
	);
}
