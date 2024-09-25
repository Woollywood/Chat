import { ReactNode } from 'react';
import { Textarea as UITextarea, TextAreaProps } from '@nextui-org/input';
import { Button } from '@nextui-org/button';
import { Spinner } from '@nextui-org/spinner';

import { SendIcon } from '@/components/icons';

interface Props extends TextAreaProps {
	header?: ReactNode;
	isLoading?: boolean;
	onSend?: () => void;
}

export default function Textarea({ header, isLoading, onSend, ...props }: Props) {
	function handleSend() {
		if (onSend) {
			onSend();
		}
	}

	return (
		<div className='px-6 py-4'>
			<div className='mb-2'>{header}</div>
			<UITextarea
				endContent={
					<Button
						isIconOnly
						aria-label='Send Message'
						className='self-end'
						color='primary'
						isLoading={isLoading}
						spinner={<Spinner color='white' size='sm' />}
						onClick={handleSend}>
						<SendIcon height={24} width={24} />
					</Button>
				}
				placeholder='Enter your messsage'
				readOnly={isLoading}
				{...props}
			/>
		</div>
	);
}
