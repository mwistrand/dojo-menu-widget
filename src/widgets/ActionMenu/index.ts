import { create, v, w } from '@dojo/framework/core/vdom';
import cache from '@dojo/framework/core/middleware/cache';
import icache, { ICacheResult } from '@dojo/framework/core/middleware/icache';
import Menu from '../Menu';
import MenuItem from '../MenuItem';

const factory = create({ cache, icache });

interface ActionMenuCache {
	isOpen?: boolean;
	isSubmenuOpen?: boolean;
	selected?: number;
}

const renderMenu = (
	id: string,
	icache: ICacheResult<ActionMenuCache>,
	cache: any
) => {
	return w(Menu, { id, role: 'menu', open: icache.get('isOpen') }, [
		w(MenuItem, {
			role: 'menuitem',
			label: 'Menu Item 1',
			onClick() {
				icache.set('selected', 0);
				icache.set('isOpen', false);
			}
		}),
		w(MenuItem, {
			role: 'menuitem',
			label: 'Menu Item 2',
			onClick: () => {
				icache.set('selected', 1);
				icache.set('isOpen', false);
			}
		}),
		w(
			MenuItem,
			{
				role: 'menuitem',
				aria: {
					haspopup: 'true',
					expanded: String(icache.get('isSubmenuOpen') || false)
				},
				label: 'Menu Item 3',
				onClick: () => {
					icache.set('selected', 2);
					icache.set('isOpen', false);
				},
				onToggleActive(active: boolean) {
					clearTimeout(cache.get('timer'));
					if (active) {
						icache.set('isSubmenuOpen', true);
					} else {
						cache.set(
							'timer',
							setTimeout(() => {
								icache.set('isSubmenuOpen', false);
							}, 300)
						);
					}
				}
			},
			[
				v(
					'div',
					{
						onmouseenter() {
							clearTimeout(cache.get('timer'));
						},
						onmouseleave() {
							cache.set(
								'timer',
								setTimeout(() => {
									icache.set('isSubmenuOpen', false);
								}, 300)
							);
						}
					},
					[
						w(
							Menu,
							{ open: icache.get('isSubmenuOpen'), role: 'menu' },
							[
								w(MenuItem, {
									role: 'menuitem',
									label: 'SubMenu Item 1',
									onClick: () => {
										clearTimeout(cache.get('timer'));
										icache.set('isOpen', false);
										icache.set('isSubmenuOpen', false);
									}
								}),
								w(MenuItem, {
									role: 'menuitem',
									label: 'SubMenu Item 2',
									onClick: () => {
										clearTimeout(cache.get('timer'));
										icache.set('isOpen', false);
										icache.set('isSubmenuOpen', false);
									}
								})
							]
						)
					]
				)
			]
		)
	]);
};

let nextMenuId = 0;
export default factory(function ActionMenu({ middleware: { cache, icache } }) {
	const menuId = `menu-${nextMenuId++}`;
	const isOpen = Boolean(icache.get('isOpen'));
	return v('div', {}, [
		v(
			'button',
			{
				'aria-haspopup': 'menu',
				'aria-expanded': String(isOpen),
				'aria-controls': menuId,
				onclick: () => {
					icache.set('isOpen', !icache.get('isOpen'));
				}
			},
			['Toggle Menu']
		),
		renderMenu(menuId, icache, cache)
	]);
});
