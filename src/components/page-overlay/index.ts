import markup from 'bundle-text:./index.html';
import styles from 'bundle-text:./styles.css';
import { createTemplate, createStyleSheet } from '../../utils';

class PageOverlay extends HTMLElement {

    #shadowRoot: ShadowRoot;

    #header: HTMLHeadElement;

    constructor() {

        super();

        this.#shadowRoot = this.attachShadow({ mode: 'closed' });
        this.#shadowRoot.appendChild(createStyleSheet(styles));
        this.#shadowRoot.appendChild(createTemplate(markup).content);

        /* this element must be a direct child of the document body for it
            to overlay the page correctly */
        document.body.prepend(this);
    }

    connectedCallback(): void {

        this.#shadowRoot.host.setAttribute('hidden', '');

        this.#header = <HTMLHeadElement>this.#shadowRoot.querySelector('h2');
    }

    hide(): void {

        this.#shadowRoot.host.setAttribute('hidden', '');
    }

    show(msg: string): void {
        
        this.#shadowRoot.host.removeAttribute('hidden');

        this.#header.textContent = msg;
    }
}

window.customElements.define('page-overlay', PageOverlay);

export default PageOverlay;