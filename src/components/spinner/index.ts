import styles from 'bundle-text:./styles.css';
import { createStyleSheet } from '../../utils/';

export class Spinner extends HTMLElement {

    #spinner: HTMLDivElement;

    constructor() {

        super();

        const shadowRoot = this.attachShadow({ mode: 'closed' });

        this.#spinner = document.createElement('div');

        shadowRoot.appendChild(createStyleSheet(styles));
        shadowRoot.appendChild(this.#spinner);
    }
}

window.customElements.define('loading-spinner', Spinner);