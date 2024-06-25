import markup from 'bundle-text:./index.html';
import styles from 'bundle-text:./styles.css';
import { createTemplate, createStyleSheet } from '../../utils/';

interface ZoomEventMap {
    'change': CustomEvent<{ zoomLevel: number }>
}

const zoomLevels = [10, 25, 50, 75, 90, 100, 110, 125, 150, 200, 300, 400];

class ZoomBar extends HTMLElement {

    #shadowRoot: ShadowRoot;

    #dropdown: HTMLSelectElement;

    #btnZoomOut: HTMLButtonElement;
    #btnZoomIn: HTMLButtonElement;
    #btnReset: HTMLButtonElement;

    addEventListener<K extends keyof ZoomEventMap>(type: K, listener: (this: Element, ev: ZoomEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;

    /* fallback definition for default events */
    addEventListener(type: keyof ZoomEventMap, listener: (this: Element, ev: Event) => any, options?: boolean | AddEventListenerOptions): void {
        
        super.addEventListener(type, listener, options);
    }

    constructor() {

        super();

        this.#shadowRoot = this.attachShadow({ mode: 'closed' });
        this.#shadowRoot.appendChild(createStyleSheet(styles));
        this.#shadowRoot.appendChild(createTemplate(markup).content);
    }

    connectedCallback(): void {

        this.#dropdown = <HTMLSelectElement>this.#shadowRoot.querySelector('select');

        this.#btnZoomOut = <HTMLButtonElement>this.#shadowRoot.getElementById('btn-zoom-out');
        this.#btnZoomIn = <HTMLButtonElement>this.#shadowRoot.getElementById('btn-zoom-in');
        this.#btnReset = <HTMLButtonElement>this.#shadowRoot.getElementById('btn-reset');

        for (const level of zoomLevels) {
            const zoomOption = document.createElement('option');
            zoomOption.value = level.toString();
            zoomOption.textContent = `${level}%`;
            this.#dropdown.appendChild(zoomOption);
        }

        this.#btnZoomOut.addEventListener('click', this.zoomOut.bind(this));

        this.#btnZoomIn.addEventListener('click', this.zoomIn.bind(this));

        this.#btnReset.addEventListener('click', this.resetZoomLevel.bind(this));

        this.#dropdown.addEventListener('change', _ => {
            this.#updateUI();
            this.#dispatchChangeEvent();
        });

        this.resetZoomLevel();
    }

    #dispatchChangeEvent(): void {

        this.dispatchEvent(new CustomEvent('change', { detail: { zoomLevel: this.zoomLevel } }));
    }

    resetZoomLevel(): void {

        const defaultOption = <HTMLOptionElement | null>this.#dropdown.querySelector('option[value="100"]');

        if (defaultOption && defaultOption !== this.#dropdown.selectedOptions[0]) {

            defaultOption.selected = true;
            this.#updateUI();
            this.#dispatchChangeEvent();
        }
    }

    #updateUI(): void {

        this.#btnZoomOut.disabled = this.#dropdown.selectedIndex <= 0;
        this.#btnZoomIn.disabled = this.#dropdown.selectedIndex >= this.#dropdown.length - 1;
    }

    zoomIn() {

        if (this.#dropdown.selectedIndex >= this.#dropdown.length - 1)
            return;

        ++this.#dropdown.selectedIndex;

        this.#updateUI();
        this.#dispatchChangeEvent();
    }

    zoomOut() {
        
        if (this.#dropdown.selectedIndex <= 0)
            return;

        --this.#dropdown.selectedIndex;

        this.#updateUI();
        this.#dispatchChangeEvent();
    }

    get zoomLevel(): number { return zoomLevels[this.#dropdown.selectedIndex] ?? 0; }
}

window.customElements.define('zoom-bar', ZoomBar);

export default ZoomBar;