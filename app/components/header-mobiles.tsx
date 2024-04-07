'use client'

import React, {  useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { SIDENAV_ITEMS } from '../constants/constants'
import {  MenuItemWithSubMenuProps } from '../constants/types'
import { Icon } from '@iconify/react'
import { motion, useCycle } from 'framer-motion'
import path from 'path'



const sidebar = {
	open: (height = 1000) => ({
		clipPath: `circle(${height * 2 + 200}px at 100% 0)`,
		transition: {
			type: "spring",
			stiffness: 400,
			damping: 40,
		}
	})
}

const variants = {
	open: {
		transition: { staggerChildren: 0.02, delayChildren: 0.15 },
	},
	closed: {
		transition: { staggerChildren: 0.01, delayChildren: -1 },
	}
}

const HeaderMobile = () => {

	const pathname = usePathname()
	const containerRef = useRef(null)
	const { height } = useDimensions(containerRef)
	const [isopen, toggleOpen] = useCycle(false, true)


	return (
		<motion.nav
			initial={false}
			animate={isopen ? "open" : "close"}
			custom={height}
			className={`fixed inset-0 z-50 w-full md:hidden ${
				!isopen && "pointer-events-none"
				}`}
			ref={containerRef}
		>
			<motion.div
				variants={sidebar}
				className='absolut inset-0 right-0 w-full bg-white'
			/>

			<motion.ul
				className='absolut grid w-full right-0 bg-white'
				variants={variants}
			>
				{
					SIDENAV_ITEMS.map((item, index) => {
						const islastItem = index === SIDENAV_ITEMS.length - 1;
						return (
							<div key={index}>
								{item.submenu ? (
									<MenuItemWithSubMenu  item={item} toggleOpen={toggleOpen} />
								) : (
										<MenuItem>
											<Link
												href={item.path}
												onClick={() => toggleOpen()}
												className={`flex w-full text-2xl ${
													item.path == pathname ? "font-bold" : ""
												}`}
											>
												{item.title}
											</Link>
										</MenuItem>
								)}
								
								{
									!islastItem && (
										<MenuItem className='my-3 h-px w-full bg-gray-300' />
									)
								}

							</div>
						)
					})
				}
			</motion.ul>
			<MenuToggle toggle={toggleOpen}/>	
		</motion.nav>
	)
}

export default HeaderMobile

const MenuToggle = ({ toggle }: { toggle: () => any }) => {
	return (
		<button
			className=' pointer-events-auto absolute right-4 top-[14px] z-30'
			onClick={toggle}
		>
			<svg width="23" height="23" viewBox='0 0 23 23'>
				<Path
					variants={{
						closed: { d: "M 2 2.5 L 20 2.5" },
						open: { d: "M 3 16.5 L 17 2.5" },
					}}
				/>
				<Path
					d="M 2 9.423 L 20 9.423"
					variants={{
						closed: { opacity: 1 },
						open: { opacity: 0 },
					}}
					transition={{ duration: 0.1 }}
				/>
				<Path
					variants={{
						closed: { d: "M 2 16.346 L 20 16.346" },
						open: { d: "M 3 2.5 L 17 16.346" },
					}}
				/>
			</svg>
		</button>
	)


}
const Path = (props: any) => (
	<motion.path
		fill="transparent"
		strokeWidth="2"
		stroke="hsl(0 ,0%, 18%)"
		strokeLinecap="round"
		{...props}
	/>
)

const MenuItemWithSubMenu: React.FC<MenuItemWithSubMenuProps> = ({
	item,
	toggleOpen,
}) => {
	const pathname = usePathname()
	const [submenuOpen, setSubmenuOpen] = useState(false)

	return (
		<>
			<MenuItem>
				<button
					onClick={() => setSubmenuOpen(!submenuOpen)}
					className='flex w-full text-2xl'
				>
					<div className='flex flex-row justify-between w-full items-center'>
						<span className={`${pathname.includes(item.path) ? "font-bold" : ""}`}>
							{ item.title }
						</span>
						<div className={`${submenuOpen && "rotate-180"}`}>
							<Icon icon='lucide:chevron-down' width="24" height="24" />
						</div>
					</div>

				</button>
			</MenuItem>
			<div className='mt-2 ml-2 flex flex-col space-y-2'>
				{
					submenuOpen && (
						<>
							{
								item.subMenuItems?.map((subMenuItem, index) => {
									return (
										<MenuItem key={index}>
											<Link
												href={subMenuItem.path}
												onClick={() => toggleOpen()}
												className={`${subMenuItem.path === pathname ? "font-bold" : ""}`}
											>
												{ subMenuItem.title }
											</Link>
										</MenuItem>
									)
								})
							}
						</>
					)
				}
			</div>
		</>
	)
}

const MenuItemVariants = {
	open: {
		y: 0,
		opacity: 1,
		transiton: {
			y: { stiffness: 1000, velocity: -100},
		}
	},

	closed: {
		y: 50,
		opacity: 0,
		transition: {
			y: { stiffness: 1000, },
			duration: 0.2,
		}
	}
}

const MenuItem = ({
	className,
	Children,
} : {
	className?: string,
	Children?: React.ReactNode,
	}) => {
	return (
		<motion.li className={className} variants={MenuItemVariants}>
			{Children}
		</motion.li>
	)
}

const useDimensions = (ref: any) => {
	const dimensions = useRef({ width: 0, height: 0 })
	
	useEffect(() => {
		if (ref.current) {
			dimensions.current.width = ref.current.offsetWidth
			dimensions.current.height = ref.current.offsetHeight
		}
	}, [ref])

	return dimensions.current
}