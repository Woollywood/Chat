import { useSelector } from 'react-redux';
import { Button } from '@nextui-org/button';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownSection, DropdownItem } from '@nextui-org/dropdown';
import { Skeleton } from '@nextui-org/skeleton';
import { Link } from '@nextui-org/link';

import Avatar from './avatar';
import { PlusIcon } from './icons';

import { RootState } from '@/store';
import { supabase } from '@/supabase';

export default function NavbarUser() {
	const { session, isComplete, profile } = useSelector((state: RootState) => state.session);

	async function signout() {
		await supabase.auth.signOut();
	}

	return (
		<>
			{isComplete ? (
				session?.user ? (
					<Dropdown
						showArrow
						classNames={{
							base: 'before:bg-default-200',
							content: 'p-0 border-small border-divider bg-background',
						}}
						radius='sm'>
						<DropdownTrigger>
							<Avatar
								isBordered
								as='button'
								className='transition-transform'
								color='secondary'
								name={profile?.full_name!}
								size='md'
								src={profile?.avatar_url!}
							/>
						</DropdownTrigger>
						<DropdownMenu
							aria-label='Custom item styles'
							className='p-3'
							disabledKeys={['profile']}
							itemClasses={{
								base: [
									'rounded-md',
									'text-default-500',
									'transition-opacity',
									'data-[hover=true]:text-foreground',
									'data-[hover=true]:bg-default-100',
									'dark:data-[hover=true]:bg-default-50',
									'data-[selectable=true]:focus:bg-default-50',
									'data-[pressed=true]:opacity-70',
									'data-[focus-visible=true]:ring-default-500',
								],
							}}>
							<DropdownSection showDivider aria-label='Profile & Actions'>
								<DropdownItem key='profile' isReadOnly className='h-14 gap-2 opacity-100'>
									<div className='inline-flex items-center justify-center gap-2'>
										<Avatar
											isBordered
											as='button'
											className='ml-1 mt-0.5 transition-transform'
											color='secondary'
											name={profile?.full_name!}
											size='sm'
											src={profile?.avatar_url!}
										/>
										<div className='inline-flex flex-col items-start'>
											<span className='text-small text-default-600'>{`@${profile?.username}`}</span>
											<span className='text-tiny text-default-500'>{profile?.full_name!}</span>
										</div>
									</div>
								</DropdownItem>
								<DropdownItem key='dashboard' href='/dashboard'>
									Dashboard
								</DropdownItem>
								<DropdownItem key='settings' href='/settings'>
									Settings
								</DropdownItem>
								<DropdownItem
									key='new_project'
									endContent={<PlusIcon className='text-large' />}
									href='/new-project'>
									New Project
								</DropdownItem>
							</DropdownSection>

							<DropdownSection aria-label='Help & Feedback'>
								<DropdownItem key='help_and_feedback' href='/help'>
									Help & Feedback
								</DropdownItem>
								<DropdownItem key='logout' onClick={signout}>
									Log Out
								</DropdownItem>
							</DropdownSection>
						</DropdownMenu>
					</Dropdown>
				) : (
					<div className='flex items-center gap-4'>
						<Button as={Link} href='/sign-in' size='md'>
							Sign in
						</Button>

						<Button as={Link} href='sign-up' size='md'>
							Sign up
						</Button>
					</div>
				)
			) : (
				<div>
					<Skeleton className='flex h-10 w-10 rounded-full' />
				</div>
			)}
		</>
	);
}
