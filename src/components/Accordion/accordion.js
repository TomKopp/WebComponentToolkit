import { attr2bool, bool2attr } from '../../utility';
import { defineElement, property } from '../../decorators';
import { BaseElement } from '../Base/base-element';

@defineElement('wctk-accordion')
export class Accordion extends BaseElement {
	@property({
		reflect: true
		, prop2attr: bool2attr
		, attr2prop: attr2bool
	})
	multiple = false;

	@property({
		reflect: true
		, attr2prop(val) { return Number(val); }
		, prop2attr(val) { return String(val); }
	})
	selectedIndex = null;


	updateTemplate() { return '<div class="accordion"><slot></slot></div>'; }

	updateStyle() { return `
:host {
	display: block;
}`; }
}
