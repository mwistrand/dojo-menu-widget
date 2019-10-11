import { create, v, w } from '@dojo/framework/core/vdom';
import icache from '@dojo/framework/core/middleware/icache';
import theme from '@dojo/framework/core/middleware/theme';
import dojo from '@dojo/themes/dojo';

import ActionMenu from './widgets/ActionMenu/index';
import Select from './widgets/Select';

import * as css from './App.m.css';

const factory = create({ icache, theme });

export default factory(function App({ middleware: { icache, theme } }) {
	if (!theme.get()) {
		theme.set(dojo);
	}
	return v('div', { classes: [css.root] }, [
		w(ActionMenu, {}),
		w(Select, {
			placeholder: '-- Select --',
			value: icache.get('selected-value'),
			options: [
				{ label: 'First', value: 0 },
				{ label: 'Second', value: 1 },
				{ label: 'Third', value: 2 }
			],
			onSelect(value: number) {
				icache.set('selected-value', value);
			}
		})
	]);
});
