import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from '@nextui-org/modal';
import { Button } from '@nextui-org/button';
import { Input } from '@nextui-org/input';
import { Spinner } from '@nextui-org/spinner';
import { useForm } from 'react-hook-form';

import { PlusIcon } from '@/components/icons';
import AvatarViewer from '@/components/inputs/avatar';
import { AppDispatch, RootState } from '@/store';
import { Database } from '@/types/supabase';
import { createChannelAction } from '@/stores/channels';

type FormData = {
	channelName: string;
};

export default function AddNew() {
	const [isLoading, setLoading] = useState(false);
	const { profile } = useSelector((state: RootState) => state.session);
	const dispatch = useDispatch<AppDispatch>();
	const { isOpen, onOpen, onOpenChange } = useDisclosure();

	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm<FormData>();
	const onSubmit = handleSubmit(async ({ channelName }) => {
		setLoading(true);
		await handleCreate(channelName, profile!);
		setValue('channelName', '');
		setLoading(false);
	});

	async function handleCreate(name: string, profile: Database['public']['Tables']['profiles']['Row']) {
		await dispatch(createChannelAction({ name, profile }));
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
									<AvatarViewer className='flex-shrink-0' name='Avatar' size='lg' />
									<div className='flex flex-col gap-1'>
										<Input
											className='w-full max-w-64 bg-transparent outline-none'
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
									</div>
								</div>
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
