import { title } from '@/components/primitives';

export function Component() {
	return (
		<section className='flex flex-col items-center justify-center gap-4 py-8 md:py-10'>
			<div className='inline-block max-w-lg justify-center text-center'>
				<h1 className={title()}>Blog</h1>
			</div>
		</section>
	);
}
