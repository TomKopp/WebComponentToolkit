import { defineElement, property } from '../../decorators';
import { BaseElement } from '../Base/base-element';

@defineElement('wctk-accordion-tab')
export class AccordionTab extends BaseElement {
	ActivationEvent = new CustomEvent('AccordionTab', {
		bubbles: true
		, composed: true
		, detail: this
	});

	@property()
	header = 'Accordion tab default header';

	@property({
		observe: false
		, onChange() {
			this.classList.toggle('active');
			this.dispatchEvent(this.ActivationEvent);
		}
	})
	active = false;

	updateTemplate() {
		return `<div class="header">
		<i class="header-ico"><svg width="1em" height="1em" viewBox="0 0 24 24" style="fill: currentcolor;"><path d="M8.59 16.34l4.58-4.59-4.58-4.59L10 5.75l6 6-6 6z"></path></svg></i>
		<slot name="header">${this.header}</slot>
	</div>
	<div class="collapsable"><div class="content"><slot></slot></div></div>`;
	}

	updateStyle() {
		return `:host {
	display: block;
}
:host([hidden]) {
	display: none;
}
.header {
	align-items: center;
	background-color: #fff;
	cursor: pointer;
	display: flex;
	padding: 1rem;
	transition: background-color 0.2s;
}
.header-ico > svg {
	height: 1.125rem;
	margin-right: 1rem;
	transform-origin: center;
	transition: transform 0.2s;
	width: 1.125rem;
}
.collapsable {
	max-height: 0;
	overflow: hidden;
	transition: max-height 0.2s;
}
.content {
	margin: 0.5rem 1rem 2rem 3.125rem;
}
:host(.active) .header {
	background-color: rgb(248, 248, 248);
}
:host(.active) .header-ico > svg {
	transform: rotate(90deg);
}
:host(.active) .collapsable {
	max-height: 100vh;
}`;
	}

	preRender() {
		const header = this.template.content.querySelector('.header');
		if (header) {
			header.addEventListener('click', () => (this.active = !this.active));
		}
	}
}
