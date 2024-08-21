import { forwardRef, useEffect, useState } from 'react';
import { Avatar as UIAvatar, AvatarProps } from '@nextui-org/avatar';

import { supabase } from '@/supabase';

const Avatar = forwardRef<HTMLSpanElement | null, AvatarProps>(({ src, ...other }, ref) => {
	const [url, setUrl] = useState<string | null>(null);

	useEffect(() => {
		async function download(path: string) {
			const { data } = await supabase.storage.from('avatars').download(path);
			const url = URL.createObjectURL(data!);

			setUrl(url);
		}

		if (src) {
			download(src);
		}
	}, [src]);

	return <UIAvatar ref={ref} {...other} src={url ?? ''} />;
});

Avatar.displayName = 'Avatar';
export default Avatar;
