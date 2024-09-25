import { ReactNode } from 'react';
import { clsx } from 'clsx';

interface Props {
	title: string;
	children: ReactNode;
	actions?: ReactNode;
	className?: string;
}

export default function Section({ title, children, actions, className }: Props) {
	return (
		<div className={clsx('px-4 py-6', className)}>
			<div className='mb-6 flex items-center justify-between gap-4'>
				<h2 className='text-xl font-medium text-gray-500'>{title}</h2>
				{actions}
			</div>
			<div className='pl-4'>{children}</div>
		</div>
	);
}
