import { create, v } from '@dojo/framework/core/vdom';
import { formatAriaProperties } from '../util';

export interface MenuProperties {
	aria?: { [key: string]: string | null };
	id?: string;
	open?: boolean;
	role?: string;
}

const factory = create().properties<MenuProperties>();

export default factory(function Menu({ children, properties }) {
	const { aria, id, open, role } = properties();

	return v(
		'div',
		{ ...formatAriaProperties(aria || {}), hidden: !open, id, role },
		children()
	);
});
