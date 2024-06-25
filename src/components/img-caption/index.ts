import markup from 'bundle-text:./index.html';
import styles from 'bundle-text:./styles.css';
import { createTemplate, createStyleSheet } from '../../utils';

import { EffectImage } from '../effect-image';
import { ImgProps } from '../preview-image/ImgProps';
import { EffectImageEventType } from '../effect-image/EventMappings';

class ImgCaption extends HTMLElement {

    #shadowRoot: ShadowRoot;
    #figCaption: HTMLElement;

    caption: string | null;

    constructor() {

        super();

        this.#shadowRoot = this.attachShadow({ mode: 'closed' });
        this.#shadowRoot.appendChild(createStyleSheet(styles));
        this.#shadowRoot.appendChild(createTemplate(markup).content);

        this.caption = this.#shadowRoot.host.getAttribute('caption');
    }

    connectedCallback(): void {

        this.#figCaption = <HTMLElement>this.#shadowRoot.querySelector('figcaption');

        this.#figCaption.textContent = this.title;

        const slot = this.#shadowRoot.querySelector('slot[name="user-img"]') as
            HTMLSlotElement | null;

        if (slot instanceof HTMLSlotElement) {

            const imgRef = <EffectImage | undefined>slot.assignedElements()[0];

            imgRef?.addEventListener('change', e => {
                if (e.detail.type === EffectImageEventType.size) {
                    const { name, width, height } = e.detail;
                    this.#updateCaption({ name, width, height });
                }
            });

            imgRef?.addEventListener('load', (e) => {
                this.#updateCaption(e.detail);
            });
        }
    }

    #updateCaption(detail: ImgProps): void {
        
        /* caption name is optional; if not provided, the image's name will be used */
        this.#figCaption.textContent = String.prototype.concat(
            `${this.caption || detail.name} `,
            `(${detail.width.toFixed()}x${detail.height.toFixed()} pixels)`);
    }
}

window.customElements.define('img-caption', ImgCaption);

export default ImgCaption;