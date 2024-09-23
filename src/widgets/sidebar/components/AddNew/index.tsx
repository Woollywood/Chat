import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from '@nextui-org/modal';
import { Button } from '@nextui-org/button';
import { Input } from '@nextui-org/input';
import { Spinner } from '@nextui-org/spinner';
import { Textarea } from '@nextui-org/input';
import { useForm } from 'react-hook-form';

import { PlusIcon } from '@/components/icons';
import AvatarViewer from '@/components/inputs/avatar';
import { AppDispatch, RootState } from '@/store';
import { Database } from '@/types/supabase';
import { createChannelAction } from '@/stores/channels';

type FormData = {
	name: string;
	description: string;
};

export default function AddNew() {
	const [isLoading, setLoading] = useState(false);
	const [avatar, setAvatar] = useState<{ url: string; file: Blob } | null>(null);
	const { profile } = useSelector((state: RootState) => state.session);
	const dispatch = useDispatch<AppDispatch>();
	const { isOpen, onOpen, onOpenChange } = useDisclosure();

	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm<FormData>();
	const onSubmit = handleSubmit(async ({ name, description }) => {
		setLoading(true);
		await handleCreate(name, description, profile!);
		setValue('name', '');
		setValue('description', '');
		setLoading(false);
	});

	async function handleCreate(
		name: string,
		description: string,
		profile: Database['public']['Tables']['profiles']['Row'],
	) {
		await dispatch(createChannelAction({ name, description, profile, avatar: avatar! }));
	}

	async function handleCreateModal(onClose: () => void) {
		await onSubmit();
		if (Object.keys(errors).length === 0) {
			onClose();
		}
	}

	return (
		<>
			<button
				className='rounded-lg p-1 transition-colors hover:bg-foreground hover:text-background'
				onClick={onOpen}>
				<PlusIcon height={16} width={16} />
			</button>
			<Modal isOpen={isOpen} onOpenChange={onOpenChange}>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className='flex flex-col gap-1'>Create new channel</ModalHeader>
							<ModalBody>
								<div className='flex items-center gap-4'>
									<AvatarViewer
										className='flex-shrink-0'
										name='Avatar'
										size='lg'
										onUpdateUrl={setAvatar}
									/>
									<div className='flex flex-col gap-1'>
										<Input
											className='w-full max-w-64 bg-transparent outline-none'
											placeholder='Channel name'
											type='text'
											{...register('name', { required: true, minLength: 3 })}
										/>
										{errors.name && (
											<span className='text-sm text-danger-200'>
												{errors.name.type === 'required'
													? 'This field must not be empty'
													: 'The field must be at least 3 characters long'}
											</span>
										)}
									</div>
								</div>
								<Textarea
									label='Description'
									placeholder='Enter your description'
									{...register('description')}
								/>
							</ModalBody>
							<ModalFooter>
								<Button className='w-16' color='danger' variant='light' onPress={onClose}>
									Close
								</Button>
								<Button
									className='w-16'
									color='primary'
									isLoading={isLoading}
									spinner={<Spinner color='default' size='sm' />}
									onPress={() => handleCreateModal(onClose)}>
									{!isLoading && 'Create'}
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	);
}
