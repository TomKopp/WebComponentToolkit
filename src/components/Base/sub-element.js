import { defineElement, property } from '../../decorators';
import { BaseElement } from '../Base/base-element';

@defineElement('wctk-sub-element')
export class SubElement extends BaseElement {
	@property()
	title = 'Sub element title';


	updateTemplate() { return `<h1>${this.title}</h1>`; }

	updateStyle() { return ''; }
}
