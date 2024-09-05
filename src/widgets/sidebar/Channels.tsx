import { Skeleton } from '@nextui-org/skeleton';
import { NavLink } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import { DeleteIcon } from '@/components/icons';
import { Database } from '@/types/supabase';

interface Props {
	isLoading: boolean;
	isCreating: boolean;
	channels: Database['public']['Tables']['channels']['Row'][];
	onCreated: (name: string) => void;
	onDeleted: (name: string) => void;
}

type FormData = {
	channelName: string;
};

export default function Channels({ isCreating, isLoading, channels, onCreated, onDeleted }: Props) {
	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm<FormData>();
	const onSubmit = handleSubmit((data) => {
		onCreated(data.channelName);
		setValue('channelName', '');
	});

	return (
		<div className='space-y-2'>
			{isLoading ? (
				<>
					<Skeleton className='w-full rounded-lg'>
						<div className='h-6 w-full rounded-lg bg-default-200' />
					</Skeleton>
					<Skeleton className='w-full rounded-lg'>
						<div className='h-6 w-full rounded-lg bg-default-200' />
					</Skeleton>
					<Skeleton className='w-full rounded-lg'>
						<div className='h-6 w-full rounded-lg bg-default-200' />
					</Skeleton>
				</>
			) : channels.length > 0 ? (
				channels?.map((channel) => (
					<NavLink
						key={channel.id}
						className='flex items-center justify-between gap-4 whitespace-nowrap rounded-lg p-2 transition-colors hover:bg-foreground-100'
						to={`live-chat/${channel.id}`}>
						<h3 className='line-clamp-1 text-lg'># {channel.slug}</h3>
						<button
							className='flex-shrink-0 rounded-lg p-1 transition-colors hover:bg-foreground hover:text-background'
							onClick={(event) => {
								event.preventDefault();
								event.stopPropagation();
								onDeleted(channel.slug);
							}}>
							<DeleteIcon />
						</button>
					</NavLink>
				))
			) : (
				!isCreating && <p className='text-lg font-medium'>There is no channels</p>
			)}
			{isCreating && (
				<form className='p-2 text-lg' onSubmit={onSubmit}>
					<span className='pr-2'>#</span>
					<input
						// eslint-disable-next-line jsx-a11y/no-autofocus
						autoFocus
						className='bg-transparent outline-none'
						placeholder='Channel name'
						type='text'
						{...register('channelName', { required: true, minLength: 3 })}
					/>
					{errors.channelName && (
						<span>
							{errors.channelName.type === 'required'
								? 'This field must not be empty'
								: 'The field must be at least 3 characters long'}
						</span>
					)}
				</form>
			)}
		</div>
	);
}
