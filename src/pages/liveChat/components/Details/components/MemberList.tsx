import { useSelector } from 'react-redux';
import { Badge } from '@nextui-org/badge';
import { Avatar } from '@nextui-org/avatar';
import { clsx } from 'clsx';

import { Database } from '@/types/supabase';
import { DeleteIcon } from '@/components/icons';
import { RootState } from '@/store';

interface Props {
	members: (Database['public']['Tables']['channels_members']['Row'] & {
		profiles: Database['public']['Tables']['profiles']['Row'] & {
			user_activity: Database['public']['Tables']['user_activity']['Row'];
		};
	})[];
	onDelete: (userId: string) => void;
}

export default function MemberList({ members, onDelete }: Props) {
	const { session } = useSelector((state: RootState) => state.session);
	const creator = members?.find((member) => member.user_id === member.invited_by);
	const isCreator = creator?.user_id === session?.user.id;

	const filteredList = [creator, ...members.filter((member) => member.user_id !== creator?.user_id)];

	return filteredList?.map((member) => (
		<div key={member?.id}>
			<div className='flex items-center gap-2'>
				{member?.invited_by === member?.user_id ? (
					<Badge color='primary' content='creator'>
						<div className='flex items-center gap-2'>
							<Avatar src={member?.profiles?.avatar_url!} />
							<div className='flex flex-col justify-between'>
								<h4 className='text-md font-medium'>{member?.profiles?.full_name}</h4>
								<p
									className={clsx('text-[0.75rem]', {
										'text-green-400': member?.profiles.user_activity.status === 'ONLINE',
									})}>
									{member?.profiles.user_activity.status}
								</p>
							</div>
						</div>
					</Badge>
				) : (
					<>
						<Avatar src={member?.profiles?.avatar_url!} />
						<div className='flex flex-col justify-between'>
							<h4 className='text-md font-medium'>{member?.profiles?.full_name}</h4>
							<p
								className={clsx('text-[0.75rem]', {
									'text-green-400': member?.profiles.user_activity.status === 'ONLINE',
								})}>
								{member?.profiles.user_activity.status}
							</p>
						</div>
					</>
				)}

				{member?.user_id !== session?.user.id! && (session?.user.id === member?.invited_by || isCreator) && (
					<button
						className='ml-auto flex items-center justify-center rounded-lg p-1 transition-colors hover:bg-foreground hover:text-background'
						onClick={() => onDelete(member?.user_id!)}>
						<DeleteIcon />
					</button>
				)}
			</div>
		</div>
	));
}
