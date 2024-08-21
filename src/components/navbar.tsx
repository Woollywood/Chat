import { Kbd } from '@nextui-org/kbd';
import { Link } from '@nextui-org/link';
import { Input } from '@nextui-org/input';
import {
	Navbar as NextUINavbar,
	NavbarBrand,
	NavbarContent,
	NavbarItem,
	NavbarMenuToggle,
	NavbarMenu,
	NavbarMenuItem,
} from '@nextui-org/navbar';
import { link as linkStyles } from '@nextui-org/theme';
import clsx from 'clsx';

import NavbarUser from './navbarUser';

import { siteConfig } from '@/config/site';
import { ThemeSwitch } from '@/components/theme-switch';
import { GithubIcon, SearchIcon } from '@/components/icons';
import { Logo } from '@/components/icons';

export const Navbar = () => {
	const searchInput = (
		<Input
			aria-label='Search'
			classNames={{
				inputWrapper: 'bg-default-100',
				input: 'text-sm',
			}}
			endContent={
				<Kbd className='hidden lg:inline-block' keys={['command']}>
					K
				</Kbd>
			}
			labelPlacement='outside'
			placeholder='Search...'
			startContent={<SearchIcon className='pointer-events-none flex-shrink-0 text-base text-default-400' />}
			type='search'
		/>
	);

	return (
		<NextUINavbar maxWidth='xl' position='sticky'>
			<NavbarContent className='basis-1/5 sm:basis-full' justify='start'>
				<NavbarBrand className='max-w-fit gap-3'>
					<Link className='flex items-center justify-start gap-1' color='foreground' href='/'>
						<Logo />
						<p className='font-bold text-inherit'>ACME</p>
					</Link>
				</NavbarBrand>
				<div className='ml-2 hidden justify-start gap-4 lg:flex'>
					{siteConfig.navItems.map((item) => (
						<NavbarItem key={item.href}>
							<Link
								className={clsx(
									linkStyles({ color: 'foreground' }),
									'data-[active=true]:font-medium data-[active=true]:text-primary',
								)}
								color='foreground'
								href={item.href}>
								{item.label}
							</Link>
						</NavbarItem>
					))}
				</div>
			</NavbarContent>
			<NavbarContent className='hidden basis-1/5 sm:flex sm:basis-full' justify='end'>
				<NavbarItem className='hidden gap-2 sm:flex'>
					<Link isExternal href={siteConfig.links.github}>
						<GithubIcon className='text-default-500' />
					</Link>
					<ThemeSwitch />
				</NavbarItem>
				<NavbarItem className='hidden lg:flex'>{searchInput}</NavbarItem>
				<NavbarUser />
			</NavbarContent>

			<NavbarContent className='basis-1 pl-4 sm:hidden' justify='end'>
				<Link isExternal href={siteConfig.links.github}>
					<GithubIcon className='text-default-500' />
				</Link>
				<ThemeSwitch />
				<NavbarMenuToggle />
			</NavbarContent>

			<NavbarMenu>
				{searchInput}
				<div className='mx-4 mt-2 flex flex-col gap-2'>
					{siteConfig.navMenuItems.map((item, index) => (
						<NavbarMenuItem key={`${item}-${index}`}>
							<Link
								color={
									index === 2
										? 'primary'
										: index === siteConfig.navMenuItems.length - 1
											? 'danger'
											: 'foreground'
								}
								href='#'
								size='lg'>
								{item.label}
							</Link>
						</NavbarMenuItem>
					))}
				</div>
			</NavbarMenu>
		</NextUINavbar>
	);
};
