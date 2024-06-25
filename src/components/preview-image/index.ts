import styles from 'bundle-text:./styles.css';
import { createStyleSheet } from '../../utils/';

import { ImgProps } from './ImgProps';

export interface PreviewImageEventMap extends HTMLElementEventMap {
    'load': CustomEvent<ImgProps>
}

export class PreviewImage extends HTMLElement {

    img: HTMLImageElement;
    name: string = '';
    zoom: number = 1;
    shadow: ShadowRoot;

    addEventListener<K extends keyof PreviewImageEventMap>(type: K, listener: (this: Element, ev: PreviewImageEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;

    /* fallback definition for default events */
    addEventListener(type: string, listener: (this: PreviewImage, ev: Event) => any, options?: boolean | AddEventListenerOptions): void {
        
        super.addEventListener(type, listener, options);
    }

    constructor() {

        super();

        const shadowRoot = this.attachShadow({ mode: 'closed' });

        this.img = document.createElement('img');

        shadowRoot.appendChild(createStyleSheet(styles));
        shadowRoot.appendChild(this.img);
    }

    connectedCallback() {

        this.img.setAttribute('alt', '');
        this.img.setAttribute('draggable', 'false');
    }

    applyZoom(zoom: number): void {

        this.zoom = zoom;

        this.img.style.scale = zoom.toString();

        this.realignImg();

        this.syncOuterLayer();
    }

    realignImg(): void {
        
        const newX = ((this.img.getBoundingClientRect().width - this.img.width) * .5);
        const newY = ((this.img.getBoundingClientRect().height - this.img.height) * .5);
        this.img.style.left = `${newX}px`;
        this.img.style.top = `${newY}px`;
    };

    setImageSource(src: string, name: string = '', altText: string = ''): void {

        this.img.src = src;
        this.name = name;
        this.img.setAttribute('alt', altText);

        this.img.addEventListener('load', _ => {

            this.realignImg();

            this.dispatchEvent(new CustomEvent('load', {
                detail: <ImgProps>{
                    src: this.img.src,
                    name: this.name,
                    width: this.img.width,
                    height: this.img.height,
                }
            }));

        }, { once: true });
    }

    syncOuterLayer(): void {
        
        /* adjust the outer host element to be of the same size as the inner image;
            doing so also fixes a bug in some browsers where an element's scroll bar
            doesn't update when the size of its containing elements change */
        const { width, height } = this.img.getBoundingClientRect();
        this.style.width = `${width}px`;
        this.style.height = `${height}px`;
    }

    get height(): number { return this.getBoundingClientRect().height / this.zoom; }
    get width(): number { return this.getBoundingClientRect().width / this.zoom; }
}

window.customElements.define('preview-image', PreviewImage);