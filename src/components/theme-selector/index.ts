import markup from 'bundle-text:./index.html';
import styles from 'bundle-text:./styles.css';

import {
    createTemplate, createStyleSheet, getStorageValue, setStorageValue
} from '../../utils/';

class ThemeSelector extends HTMLElement {

    #shadow: ShadowRoot;
    #currentSelection: HTMLLIElement | null = null;
    #summary: HTMLElement;

    constructor() {

        super();

        this.#shadow = this.attachShadow({ mode: 'closed' });

        this.#shadow.appendChild(createStyleSheet(styles));
        this.#shadow.appendChild(createTemplate(markup).content);
        // this.#shadow.adoptedStyleSheets = [createStyleSheet(styles)];
    }

    connectedCallback(): void {

        this.#summary = <HTMLElement>this.#shadow.querySelector('details > summary');

        this.#shadow.querySelector('details > ul ')?.addEventListener('click', e => {
            e.target instanceof HTMLLIElement && this.#setSelection(e.target);
        });

        const storageTheme = getStorageValue('site-theme');
        if (typeof storageTheme === 'string') {

            const nodes = this.#shadow.querySelectorAll('details > ul li') as
                NodeListOf<HTMLLIElement>;

            /* set the current theme selection with the one corresponding to the
                theme in local storage */
            for (const el of nodes) {
                if (el.dataset.themeClass === storageTheme) {
                    this.#setSelection(el);
                    break;
                }
            }
        }

        document.addEventListener('click', e => {
            e.target !== this.#shadow.host && this.closeWindow();
        });

        document.addEventListener('keyup', e => {
            e.code === 'Escape' && this.closeWindow();
        });
    }

    closeWindow(): void {
        
        this.#shadow.querySelector('details')?.removeAttribute('open');
    }

    #setSelection(el: HTMLLIElement): void {

        const curTheme = String(this.#currentSelection?.dataset.themeClass);
        const newTheme = String(el.dataset.themeClass);

        if (curTheme === newTheme) {
            return;
        }

        document.documentElement.classList.remove(curTheme);
        document.documentElement.classList.add(newTheme);

        this.#summary.classList.remove(curTheme);
        this.#summary.classList.add(newTheme);

        this.#currentSelection?.classList.remove('selected');
        el.classList.add('selected');
        this.#currentSelection = el;

        this.closeWindow();

        setStorageValue('site-theme', newTheme);
    }
}

window.customElements.define('theme-selector', ThemeSelector);

export default ThemeSelector;