import { forwardRef, useEffect, useState } from 'react';
import { Avatar as UIAvatar, AvatarProps } from '@nextui-org/avatar';

import { supabase } from '@/supabase';
import { Database } from '@/types/supabase';

interface Props extends AvatarProps {
	storage: string;
}

const Avatar = forwardRef<HTMLSpanElement | null, Props>(({ src, storage, ...other }, ref) => {
	const [url, setUrl] = useState<string | null>(null);

	useEffect(() => {
		async function download(path: string) {
			const { data } = await supabase.storage.from(storage).download(path);
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
