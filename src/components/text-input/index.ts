import markup from 'bundle-text:./index.html';
import styles from 'bundle-text:./styles.css';
import { createTemplate, createStyleSheet } from '../../utils';

class TextInput extends HTMLElement {

    #input: HTMLInputElement | null = null;

    #isValid: boolean = true;

    #errorText: string = '';

    #shadowRoot: ShadowRoot;

    constructor() {
        
        super();

        this.#shadowRoot = this.attachShadow({ mode: 'closed' });

        this.#shadowRoot.appendChild(createStyleSheet(styles));
        this.#shadowRoot.appendChild(createTemplate(markup).content);
        // this.#shadow.adoptedStyleSheets = [createStyleSheet(styles)];
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string): void {

        if (oldValue !== newValue && name === 'disabled') {
            if (typeof newValue === 'string') {
                this.#shadowRoot.host.setAttribute('disabled', 'true');
                this.#shadowRoot.host.setAttribute('tabIndex', '-1');
                this.#input?.setAttribute('disabled', 'true');
            }
            else {
                this.#shadowRoot.host.removeAttribute('disabled');
                this.#shadowRoot.host.removeAttribute('tabIndex');
                this.#input?.removeAttribute('disabled');
            }
        }
    }

    connectedCallback(): void {

        this.#input = <HTMLInputElement>this.#shadowRoot.querySelector('input[type=text]');

        this.#errorText = this.#shadowRoot.host.getAttribute('errorText') ??
            'Please enter text in the correct format.';

        const label = this.#shadowRoot.host.getAttribute('label');
        if (label)
            this.#shadowRoot.querySelector('#input-label')!.textContent = label;

        const hint = this.#shadowRoot.host.getAttribute('hint');
        if (hint)
            this.#shadowRoot.querySelector('#input-hint')!.textContent = hint;

        this.#input.addEventListener('blur', () => this.validate());
        this.#input.addEventListener('input', () => this.validate());
    }

    #setInvalidState(msg: string): void {

        this.#isValid = false;

        const errorElem = this.#shadowRoot.querySelector('#error-text');
        if (errorElem)
            errorElem.textContent = msg;

        this.#shadowRoot.host.setAttribute('invalid', 'true');
    }

    #setValidState(): void {

        this.#isValid = true;

        this.#shadowRoot.host.removeAttribute('invalid');
    }

    validate(): boolean {

        const pattern = this.#shadowRoot.host.getAttribute('pattern');

        if (this.#shadowRoot.host.hasAttribute('required') && this.#input!.value.trimStart().length === 0) {
            this.#setInvalidState('Field is required.');
            return false;
        }
        else if (typeof pattern === 'string' && !new RegExp(pattern).test(this.#input!.value)) {
            this.#setInvalidState(this.#errorText);
            return false;
        }
        else {
            this.#setValidState();
            return true;
        }
    };

    static get observedAttributes() { return ['disabled']; }

    get isValid() { return this.#isValid; }
    get value() { return this.#input!.value; }
}

window.customElements.define('text-input', TextInput);

export default TextInput;