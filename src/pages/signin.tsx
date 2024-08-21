import { useState } from 'react';
import { Link } from '@nextui-org/link';
import { Input } from '@nextui-org/input';
import { Button } from '@nextui-org/button';
import { useForm } from 'react-hook-form';

import Password from '@/components/inputs/password';
import { supabase } from '@/supabase';
import { useAuthPrevent } from '@/hooks/useAuthPrevent';

type FormData = {
	email: string;
	password: string;
};

export function Component() {
	useAuthPrevent();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormData>();
	const onSubmit = handleSubmit(async ({ email, password }) => {
		await supabase.auth.signInWithPassword({
			email,
			password,
		});
	});

	const [isVisiblePassword, setIsVisiblePassword] = useState(false);
	const togglePasswordVisibility = () => setIsVisiblePassword(!isVisiblePassword);

	return (
		<div className='flex h-full items-center justify-center'>
			<div className='mx-auto max-w-lg'>
				<h1 className='mb-4 font-sans text-6xl font-medium capitalize'>Sign in to your account</h1>
				<div className='text-md mb-12'>
					<p>
						Dont have an account? <Link href='/sign-up'>Sign up</Link>
					</p>
				</div>
				<form className='space-y-4' onSubmit={onSubmit}>
					<Input
						errorMessage='Please enter a valid email'
						isInvalid={!!errors.email}
						label='Email'
						placeholder='Enter your email'
						type='text'
						{...register('email', {
							required: true,
							pattern:
								/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
						})}
					/>
					<Password
						errorMessage='Please enter a password'
						isInvalid={!!errors.password}
						isVisible={isVisiblePassword}
						{...register('password', { required: true })}
						label='Password'
						placeholder='Enter your password'
						onToggleVisible={togglePasswordVisibility}
					/>

					<Button type='submit'>Sign in</Button>
				</form>
			</div>
		</div>
	);
}
