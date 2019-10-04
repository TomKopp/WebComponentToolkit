import { defineElement, property } from '../../decorators';
import { BaseElement } from '../Base/base-element';

@defineElement('wctk-card')
export class Card extends BaseElement {
	@property({ reflect: true })
	direction = 'column';

	@property({ reflect: true })
	layout = '';

	get layoutCSS() {
		const offset = 1;
		return (this.layout.match(/\d/gu) || [])
			.map((val, key) => `.card > :nth-child(${key + offset}) {flex:${val} 1 auto;}`)
			.join('\n');
	}

	updateTemplate() {
		return `<section class="card">
	<div class="card-header"><slot name=header></slot></div>
	<div class="card-media"><slot name=media></slot></div>
	<div class="card-body"><slot name=body></slot></div>
	<div class="card-footer"><slot name=footer></slot></div>
</section>`;
	}

	updateStyle() {
		return `.card {
	box-sizing: border-box;
	display: flex;
	flex-direction: ${this.direction};
	justify-content: flex-start;
	padding: 1rem;
}
${this.layoutCSS}`;
	}
}
