import { useState, useEffect } from 'react';
import { Button } from '@nextui-org/button';
import { Modal, ModalContent, ModalHeader, ModalBody, useDisclosure } from '@nextui-org/modal';
import clsx from 'clsx';

import UserSkeleton from './UserSkeleton';

import { supabase } from '@/supabase';
import { PlusIcon } from '@/components/icons';
import { Database } from '@/types/supabase';
import Avatar from '@/components/avatar';

interface Props {
	className?: string;
	existingUserIds: string[];
	onInvite: (userId: string) => void;
}

export default function InviteModal({ className, existingUserIds, onInvite }: Props) {
	const [isLoading, setLoading] = useState(true);
	const [users, setUsers] = useState<Database['public']['Tables']['profiles']['Row'][] | null>(null);
	const { isOpen, onOpen, onOpenChange } = useDisclosure();

	useEffect(() => {
		if (isOpen) {
			fetchUsers();
		}
	}, [isOpen]);

	function onClose() {
		setLoading(true);
	}

	async function fetchUsers() {
		const { data } = await supabase
			.from('profiles')
			.select('*')
			.not('id', 'in', `(${existingUserIds.join(',')})`);

		setUsers(data);
		setLoading(false);
	}

	function inviteHandler(onClose: () => void, userId: string) {
		onInvite(userId);
		onClose();
	}

	return (
		<>
			<button
				className={clsx(
					'flex items-center justify-center rounded-lg p-1 transition-colors hover:bg-foreground hover:text-background',
					className,
				)}
				onClick={onOpen}>
				<PlusIcon />
			</button>
			<Modal isOpen={isOpen} size='sm' onClose={onClose} onOpenChange={onOpenChange}>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className='flex flex-col gap-1'>Invite user to the channel</ModalHeader>
							<ModalBody>
								{isLoading ? (
									<div className='space-y-2'>
										<UserSkeleton />
										<UserSkeleton />
										<UserSkeleton />
										<UserSkeleton />
									</div>
								) : (
									users?.map((user) => (
										<div key={user.id} className='flex items-center gap-2'>
											<Avatar src={user.avatar_url!} />
											<div className='flex flex-col justify-between'>
												<h2 className='text-md font-medium'>{user.full_name}</h2>
												<p className='text-[0.75rem]'>{user.username}</p>
											</div>
											<Button className='ml-auto' onClick={() => inviteHandler(onClose, user.id)}>
												Invite
											</Button>
										</div>
									))
								)}
							</ModalBody>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	);
}
