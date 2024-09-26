import { StoreMessage } from '@/stores/channelsMessages/types';
import { CloseIcon } from '@/components/icons';

interface Props extends StoreMessage {
	className?: string;
	onClose?: () => void;
}

export default function RepliedMessage({ profiles, text, className, onClose }: Props) {
	function handleClose() {
		if (onClose) {
			onClose();
		}
	}

	return (
		<div className='flex justify-between'>
			<div className={className}>
				<div className='text-lg font-medium'>{profiles?.username}</div>
				<p className='text-wrap'>{text}</p>
			</div>
			<button className='p-1' onClick={handleClose}>
				<CloseIcon className='fill-foreground-500' height={16} width={16} />
			</button>
		</div>
	);
}
