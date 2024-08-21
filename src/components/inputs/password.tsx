import { forwardRef } from 'react';
import { Input, InputProps } from '@nextui-org/input';

import { EyeFilledIcon, EyeSlashFilledIcon } from '@/components/icons';

interface Props extends InputProps {
	isVisible: boolean;
	onToggleVisible: () => void;
}

const Password = forwardRef<HTMLInputElement, Props>(({ isVisible, onToggleVisible, ...other }, ref) => {
	return (
		<Input
			{...other}
			ref={ref}
			endContent={
				<button
					aria-label='toggle password visibility'
					className='focus:outline-none'
					type='button'
					onClick={onToggleVisible}>
					{isVisible ? (
						<EyeSlashFilledIcon className='pointer-events-none text-2xl text-default-400' />
					) : (
						<EyeFilledIcon className='pointer-events-none text-2xl text-default-400' />
					)}
				</button>
			}
			type={isVisible ? 'text' : 'password'}
		/>
	);
});

Password.displayName = 'Password';

export default Password;
