import { ReactNode } from 'react';
import { Popover, PopoverTrigger, PopoverContent, PopoverProps } from '@nextui-org/popover';

import { EllipsisIcon } from '@/components/icons';

interface Props extends Omit<PopoverProps, 'children'> {
	children: ReactNode;
}

export default function ActionPopover({ children, ...props }: Props) {
	function onClick(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
		event.preventDefault();
		event.stopPropagation();
	}

	return (
		<Popover placement='right' {...props}>
			<PopoverTrigger onClick={onClick}>
				<button className='flex-shrink-0 rounded-lg p-1 transition-colors hover:bg-foreground hover:text-background'>
					<EllipsisIcon className='fill-foreground-300' height={16} width={16} />
				</button>
			</PopoverTrigger>
			<PopoverContent>
				<div className='flex flex-col gap-2'>{children}</div>
			</PopoverContent>
		</Popover>
	);
}
