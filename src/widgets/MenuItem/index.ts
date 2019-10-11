import { create, v } from '@dojo/framework/core/vdom';
import { DNode } from '@dojo/framework/core/interfaces';
import { formatAriaProperties } from '../util';

import * as css from './menuItem.m.css';

export interface MenuItemProperties {
	label: DNode;

	active?: boolean;
	aria?: { [key: string]: string | null };
	disabled?: boolean;
	id?: string;
	leading?: DNode;
	onClick?: () => void;
	onToggleActive?: (active: boolean) => void;
	role?: string;
	trailing?: DNode;
}

const factory = create().properties<MenuItemProperties>();

export default factory(function MenuItem({ children, properties }) {
	const {
		active,
		aria,
		disabled,
		id,
		label,
		leading,
		onClick,
		onToggleActive,
		role,
		trailing
	} = properties();

	return v(
		'div',
		{
			...formatAriaProperties(aria || {}),
			id,
			classes: [
				css.root,
				active ? css.active : undefined,
				disabled ? css.disabled : undefined
			]
		},
		[
			v('div', { classes: [css.trigger] }, [
				leading,
				v(
					'div',
					{
						classes: [css.label],
						role,
						onmouseover() {
							if (!disabled) {
								onToggleActive && onToggleActive(true);
							}
						},
						onmouseout() {
							if (!disabled) {
								onToggleActive && onToggleActive(false);
							}
						},
						onmousedown() {
							if (!disabled) {
								onClick && onClick();
							}
						}
					},
					[label]
				),
				trailing
			]),
			...children()
		]
	);
});
