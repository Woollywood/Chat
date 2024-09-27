import { forwardRef, ReactNode, useImperativeHandle, useRef } from 'react';
import { Textarea as UITextarea, TextAreaProps } from '@nextui-org/input';
import { Button } from '@nextui-org/button';
import { Spinner } from '@nextui-org/spinner';

import { SendIcon } from '@/components/icons';

interface Props extends TextAreaProps {
	header?: ReactNode;
	isLoading?: boolean;
	onSend?: () => void;
}

export interface TextareaActions {
	focus: () => void;
}

const Textarea = forwardRef<TextareaActions, Props>(({ header, isLoading, onSend, ...props }, ref) => {
	const textareaRef = useRef<HTMLTextAreaElement | null>(null);

	useImperativeHandle(ref, () => {
		return {
			focus: () => {
				textareaRef.current?.focus();
			},
		};
	}, []);

	function handleSend() {
		if (onSend) {
			onSend();
		}
	}

	return (
		<div className='px-6 py-4'>
			<div className='mb-2'>{header}</div>
			<UITextarea
				ref={textareaRef}
				// eslint-disable-next-line jsx-a11y/no-autofocus
				autoFocus
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
});

Textarea.displayName = 'Textarea';
export default Textarea;
