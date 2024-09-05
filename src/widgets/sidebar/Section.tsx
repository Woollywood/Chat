import { ReactNode } from 'react';

interface Props {
	title: string;
	children: ReactNode;
	actions?: ReactNode;
}

export default function Section({ title, children, actions }: Props) {
	return (
		<div className='px-4 py-6'>
			<div className='mb-6 flex items-center justify-between gap-4'>
				<h2 className='text-xl font-medium text-gray-500'>{title}</h2>
				{actions}
			</div>
			<div className='pl-4'>{children}</div>
		</div>
	);
}
