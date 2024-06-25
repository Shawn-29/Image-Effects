import markup from 'bundle-text:./index.html';
import styles from 'bundle-text:./styles.css';

import { createTemplate, createStyleSheet } from '../../utils';
import { IEffectEventParams } from './IEffectEventParams';

import EffectChangeEvent from './EffectChangeEvent';

export interface EffectChangeEventMap extends HTMLElementEventMap {
    'effectChange': EffectChangeEvent
}

export class EffectsArea extends HTMLElement {

    #shadowRoot: ShadowRoot;

    #chkAspectRatio: HTMLInputElement;
    #sliderWidth: HTMLInputElement;
    #sliderHeight: HTMLInputElement;

    addEventListener<K extends keyof EffectChangeEventMap>(type: K, listener: (this: Element, ev: EffectChangeEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;

    /* fallback definition for default events */
    addEventListener(type: keyof EffectChangeEventMap, listener: (this: Element, ev: Event) => any, options?: boolean | AddEventListenerOptions): void {
        
        super.addEventListener(type, listener, options);
    }

    constructor() {

        super();

        this.#shadowRoot = this.attachShadow({ mode: 'closed' });
        this.#shadowRoot.appendChild(createStyleSheet(styles));
        this.#shadowRoot.appendChild(createTemplate(markup).content);
    }

    connectedCallback(): void {

        this.resetForm();

        /* add event listener for handling image effects */
        this.#shadowRoot.getElementById('effects-grid')?.addEventListener(
            'input', this.handleEffectChange.bind(this)
        );

        this.#chkAspectRatio = <HTMLInputElement>this.#shadowRoot.getElementById('chkAspectRatio');
        this.#sliderWidth = <HTMLInputElement>this.#shadowRoot.getElementById('slider-width');
        this.#sliderHeight = <HTMLInputElement>this.#shadowRoot.getElementById('slider-height');
    }

    #dispatchEffectChange(effectInput: HTMLInputElement): void {

        this.dispatchEvent(new EffectChangeEvent({
            effectKey: effectInput.dataset?.effectKey ?? '',
            value: effectInput.value,
            reset: effectInput.disabled
        } as IEffectEventParams));
    }

    handleEffectChange(e: Event): void {

        const eventTarget = <HTMLInputElement>e.target;

        let effectTarget: HTMLInputElement;

        if (eventTarget.type === 'checkbox' && eventTarget.nextElementSibling instanceof HTMLInputElement) {

            effectTarget = eventTarget.nextElementSibling;

            /* enable or disable this effect */
            eventTarget.checked ? effectTarget.removeAttribute('disabled') :
                effectTarget.setAttribute('disabled', 'true');
        }
        else {
            effectTarget = eventTarget;
        }

        if (this.#chkAspectRatio.checked && !effectTarget.hasAttribute('disabled')) {
            if (effectTarget === this.#sliderWidth) {
                this.#maintainAspectRatio(this.#sliderHeight, effectTarget);
            }
            else if (effectTarget === this.#sliderHeight) {
                this.#maintainAspectRatio(this.#sliderWidth, effectTarget);
            }
        }

        this.#dispatchEffectChange(effectTarget);
    }

    #maintainAspectRatio(target: HTMLInputElement, src: HTMLInputElement): void {
        
        target.value = src.value;
        target.removeAttribute('disabled');
        
        if (target.previousElementSibling instanceof HTMLInputElement)
            target.previousElementSibling.checked = true;
    }

    resetForm(): void {

        const form = this.#shadowRoot.querySelector('form');
        if (form instanceof HTMLFormElement) {

            form.reset();

            /* disable all range inputs when a form resets */
            form.querySelectorAll('input[type="range"]')
                .forEach((slider) => {
                    slider.setAttribute('disabled', 'true');
                });
        }
    };
}

window.customElements.define('effects-area', EffectsArea);