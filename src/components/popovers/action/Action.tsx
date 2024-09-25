import { ReactNode, MouseEvent } from 'react';

interface Props {
	icon: ReactNode;
	children: ReactNode;
	onClick?: (event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => void;
}

export default function Action({ icon, children, onClick }: Props) {
	function handleClick(event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) {
		if (onClick) {
			onClick(event);
		}
	}

	return (
		<button
			className='flex items-center gap-2 rounded-lg p-1 transition-colors hover:bg-foreground hover:text-background'
			onClick={handleClick}>
			{icon}
			{children}
		</button>
	);
}
