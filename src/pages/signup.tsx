import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Link } from '@nextui-org/link';
import { Input } from '@nextui-org/input';
import { Button } from '@nextui-org/button';
import { useForm } from 'react-hook-form';

import Password from '@/components/inputs/password';
import { supabase } from '@/supabase';
import { useAuthPrevent } from '@/hooks/useAuthPrevent';

type FormData = {
	firstName: string;
	lastName: string;
	username: string;
	email: string;
	password: string;
	confirmPassword: string;
};

export function Component() {
	useAuthPrevent();
	const { state } = useLocation();
	const navigate = useNavigate();

	const [isSuccess, setSuccess] = useState(false);
	const {
		register,
		handleSubmit,
		setError,
		reset,
		formState: { errors },
	} = useForm<FormData>();
	const onSubmit = handleSubmit(async ({ firstName, lastName, username, email, password, confirmPassword }) => {
		if (password !== confirmPassword) {
			setError('password', { type: 'mismatch' });
			setError('confirmPassword', { type: 'mismatch' });

			return;
		}

		await supabase.auth.signUp({
			email,
			password,
			options: {
				data: {
					full_name: `${firstName} ${lastName}`,
					username,
				},
			},
		});

		setSuccess(true);
		reset();
	});

	const [isVisiblePassword, setIsVisiblePassword] = useState(false);
	const togglePasswordVisibility = () => setIsVisiblePassword(!isVisiblePassword);

	function getPasswordErrorMessage(type: 'required' | 'mismatch') {
		switch (type) {
			case 'required':
				return 'Please enter a password';
			case 'mismatch':
				return 'Passwords mismatch';
		}
	}

	if (isSuccess) {
		return (
			<div className='flex h-full items-center justify-center'>
				<div className='mx-auto'>
					<p className='mb-8 text-4xl'>The invitation has been sent to your email.</p>
					<div className='flex items-center justify-center'>
						<Button type='submit' onClick={() => setSuccess((prev) => !prev)}>
							Back to form
						</Button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className='flex h-full items-center justify-center'>
			<div className='mx-auto max-w-lg'>
				<h2 className='mb-4 font-serif text-lg uppercase'>start for free</h2>
				<h1 className='mb-4 font-sans text-6xl font-medium capitalize'>Create new account</h1>
				<div className='text-md mb-12'>
					<p>
						Already A Member?{' '}
						<Link
							href='/sign-in'
							onClick={(e) => {
								e.preventDefault();
								navigate('/sign-in', { state });
							}}>
							Sign in
						</Link>
					</p>
				</div>
				<form className='space-y-4' onSubmit={onSubmit}>
					<div className='flex items-center gap-4'>
						<Input
							errorMessage='Please enter a first name'
							isInvalid={!!errors.firstName}
							label='First name'
							placeholder='Enter your first name'
							type='text'
							{...register('firstName', { required: true })}
						/>
						<Input
							errorMessage='Please enter a last name'
							isInvalid={!!errors.lastName}
							label='Last name'
							placeholder='Enter your last name'
							type='text'
							{...register('lastName', { required: true })}
						/>
					</div>
					<Input
						errorMessage='Please enter a username'
						isInvalid={!!errors.username}
						label='Username'
						placeholder='Enter your username'
						type='text'
						{...register('username', {
							required: true,
						})}
					/>
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
						errorMessage={getPasswordErrorMessage(errors.password?.type as 'required' | 'mismatch')}
						isInvalid={!!errors.password}
						isVisible={isVisiblePassword}
						{...register('password', { required: true })}
						label='password'
						placeholder='Enter your password'
						onToggleVisible={togglePasswordVisibility}
					/>
					<Password
						errorMessage={getPasswordErrorMessage(errors.confirmPassword?.type as 'required' | 'mismatch')}
						isInvalid={!!errors.confirmPassword}
						isVisible={isVisiblePassword}
						{...register('confirmPassword', { required: true })}
						label='confirm password'
						placeholder='Confirm your password'
						onToggleVisible={togglePasswordVisibility}
					/>
					<Button type='submit'>Create Account</Button>
				</form>
			</div>
		</div>
	);
}
