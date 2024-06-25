import markup from 'bundle-text:./index.html';
import styles from 'bundle-text:./styles.css';
import { createTemplate, createStyleSheet } from '../../utils/';

import { parseNum } from '../../utils/';
import { saveCallback, saveTypes } from './save-params';
import TextInput from '../text-input';

import rafTimeout from '../../utils/raf-timeout';

class SaveBar extends HTMLElement {

    #shadowRoot: ShadowRoot;

    #dropdown: HTMLSelectElement;
    #saveBtn: HTMLButtonElement;
    #qualityRange: HTMLInputElement;
    #textInput: TextInput;

    #isEnabled: boolean = false;

    #saveHandler = (...args: any) => { };

    constructor() {

        super();

        this.#shadowRoot = this.attachShadow({ mode: 'closed' });
        this.#shadowRoot.appendChild(createStyleSheet(styles));
        this.#shadowRoot.appendChild(createTemplate(markup).content);
    }

    connectedCallback(): void {

        this.#dropdown = this.#shadowRoot.querySelector('select')!;
        this.#qualityRange = this.#shadowRoot.querySelector('input[type="range"]')!;
        this.#saveBtn = this.#shadowRoot.querySelector('button')!;
        this.#textInput = this.#shadowRoot.querySelector('text-input')!;

        const qualitySettings = <HTMLDivElement>this.#shadowRoot.getElementById('quality-settings');
        const qualityText = <HTMLElement>this.#shadowRoot.getElementById('quality-text');
        const qualitySlider = <HTMLInputElement>this.#shadowRoot.getElementById('quality-slider');

        const updateQualityText = () => {
            qualityText.textContent = qualitySlider.value || '';
        };

        this.#dropdown.addEventListener('change', () => {
            qualitySettings.style.setProperty('visibility',
                this.#dropdown!.value === 'jpeg' ? 'visible' : 'hidden');
        });

        qualitySlider.addEventListener('input', updateQualityText);

        this.#textInput.addEventListener('input', _ => {
            if (this.#textInput.isValid) {
                this.enable();
            }
            else {
                this.disable();
            }
        });

        updateQualityText();
    }

    disable(): void {

        this.#isEnabled = false;
        this.#saveBtn.disabled = true;
    }

    enable(): void {
        
        this.#isEnabled = true;
        this.#saveBtn.disabled = false;
    }

    setSaveHandler(userSaveHandler: saveCallback): void {

        /* remove the previous save handler */
        this.#saveBtn.removeEventListener('click', this.#saveHandler);

        this.#saveHandler = (e: Event) => {

            e.preventDefault();

            if (this.#isEnabled && this.#textInput.validate()) {

                this.disable();

                const type: saveTypes = <saveTypes | undefined>this.#dropdown?.value ?? 'jpeg';

                userSaveHandler({
                    filename: `${this.#textInput?.value ?? ''}.${type}`,
                    type,
                    quality: parseNum(this.#qualityRange?.value, 70)
                });

                rafTimeout(3000, this.enable.bind(this));
            }
        };

        this.#saveBtn.addEventListener('click', this.#saveHandler);
    }
}

window.customElements.define('save-bar', SaveBar);

export default SaveBar;