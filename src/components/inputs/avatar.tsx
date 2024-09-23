import { ChangeEvent, useState } from 'react';
import { Avatar as UIAvatar, AvatarProps } from '@nextui-org/avatar';
import { isNil } from 'lodash-es';

import Avatar from '../avatar';

interface Props extends AvatarProps {
	onUpdateUrl?: (avatar: { url: string; file: Blob }) => void;
}

export default function AvatarInput({ src, onUpdateUrl, ...props }: Props) {
	const [url, setUrl] = useState<string | null>(null);
	const isLocal = isNil(src);

	function onChange({ target }: ChangeEvent<HTMLInputElement>) {
		if (target.files) {
			const file = target.files[0];
			const url = URL.createObjectURL(file);

			setUrl(url);

			const fileExt = file.name.split('.').pop();
			const fileName = `${Math.random()}.${fileExt}`;

			if (onUpdateUrl) {
				onUpdateUrl({ url: fileName, file });
			}
		}
	}

	return (
		<label className='relative cursor-pointer overflow-hidden'>
			<input className='absolute left-0 top-0 opacity-0' type='file' onChange={onChange} />
			{isLocal ? (
				<UIAvatar src={url!} {...props} />
			) : isNil(url) ? (
				<Avatar src={src} {...props} storage='channels_avatars' />
			) : (
				<UIAvatar src={url!} {...props} />
			)}
		</label>
	);
}
