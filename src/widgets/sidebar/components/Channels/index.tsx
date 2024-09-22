import { useSelector, useDispatch } from 'react-redux';
import { Skeleton } from '@nextui-org/skeleton';
import { NavLink } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import { useChannels } from '../../hooks';

import Actions from './components/Actions';

import { Database } from '@/types/supabase';
import { AppDispatch, RootState } from '@/store';
import { createChannelAction } from '@/stores/channels';

interface Props {
	isCreating: boolean;
	onCreated: () => void;
}

type FormData = {
	channelName: string;
};

export default function Channels({ isCreating, onCreated }: Props) {
	const { channels } = useSelector((state: RootState) => state.channels);
	const { profile } = useSelector((state: RootState) => state.session);
	const dispatch = useDispatch<AppDispatch>();
	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm<FormData>();
	const onSubmit = handleSubmit(({ channelName }) => {
		handleCreate(channelName, profile!);
		setValue('channelName', '');
	});

	const { isChannelsLoading } = useChannels();

	function handleCreate(name: string, profile: Database['public']['Tables']['profiles']['Row']) {
		onCreated();
		dispatch(createChannelAction({ name, profile }));
	}

	return (
		<div className='space-y-2'>
			{isChannelsLoading ? (
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
			) : channels?.length! > 0 ? (
				channels?.map((channel) => (
					<NavLink
						key={channel.id}
						className='flex items-center justify-between gap-4 whitespace-nowrap rounded-lg p-2 transition-colors hover:bg-foreground-100'
						to={`live-chat/${channel.id}`}>
						<h3 className='line-clamp-1 text-lg'># {channel.name}</h3>
						<Actions channelId={channel.id} />
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
						<span className='text-sm text-danger-200'>
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
