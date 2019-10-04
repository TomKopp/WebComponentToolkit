import { defineElement, property } from '../../decorators';
import { BaseElement } from '../Base/base-element';

@defineElement('wctk-accordion-tab')
export class AccordionTab extends BaseElement {
	@property()
	header = 'Accordion tab default header';


	updateTemplate() {
		return `<section class="accordion-tab">
	<div class="accordion-tab-header">
		<i class="accordion-tab-header-ico"><svg width="1em" height="1em" viewBox="0 0 24 24" style="fill: currentcolor;"><path d="M8.59 16.34l4.58-4.59-4.58-4.59L10 5.75l6 6-6 6z"></path></svg></i>
		<slot name="header">${this.header}</slot>
	</div>
	<div class="accordion-tab-content"><slot></slot></div>
</section>`;
	}

	updateStyle() {
		return `:host {
	display: block;
}
.accordion-tab-header {
	align-items: center;
	background-color: #fff;
	cursor: pointer;
	display: flex;
	padding: 1rem;
	transition: background-color 0.3s;
}
.accordion-tab-header-ico {
	font-size: 1.125rem;
	margin-right: 1rem;
	transition: transform 0.2s;
}
.accordion-tab-content {
	padding: 0.5rem 1rem 2rem 3.125rem;
}
:host(.active) .accordion-tab-header {
	background-color: rgb(248, 248, 248);
}
:host(.active) .accordion-tab-header-ico {
	transform: rotate(90deg);
}`;
	}
}
