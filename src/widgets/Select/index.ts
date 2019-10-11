import { create, v, w } from '@dojo/framework/core/vdom';
import { cache } from '@dojo/framework/core/middleware/cache';
import { icache } from '@dojo/framework/core/middleware/icache';
import Menu from '../Menu';
import MenuItem from '../MenuItem';

export interface SelectProperties<T = any> {
	options: Array<{ label: string; value: T }>;
	onSelect?: (value: T) => void;
	placeholder?: string;
	value?: T;
}

const factory = create({ cache, icache }).properties<SelectProperties>();

let nextId = 0;

export default factory(function Select({
	middleware: { cache, icache },
	properties
}) {
	const { options, onSelect, placeholder, value } = properties();
	let selectedText = placeholder;

	if (!cache.get('id')) {
		cache.set('id', `${nextId++}-select`);
	}

	if (value != null) {
		const selectedOption =
			options && options.find((option) => option.value === value);
		if (selectedOption) {
			selectedText = selectedOption.label;
		}
	}

	const menuAria: { [key: string]: string | null } = {
		activedescendant:
			icache.get('active') != null
				? `${cache.get('id')}-${icache.get('active')}`
				: null
	};

	return v('div', {}, [
		v(
			'div',
			{
				styles: { display: 'inline-block' },
				tabIndex: 0,
				onfocus: () => icache.set('isActive', true),
				onblur: () => icache.set('isActive', false)
			},
			[selectedText || (options && options[0] && options[0].label)]
		),
		w(
			Menu,
			{ aria: menuAria, open: icache.get('isActive'), role: 'listbox' },
			options.map(({ label, value }) => {
				return w(MenuItem, {
					key: value,
					id: `${cache.get('id')}-${value}`,
					role: 'option',
					active: icache.get('active') === value,
					label,
					onClick() {
						onSelect && onSelect(value);
					}
				});
			})
		)
	]);
});
