import FilterGroup from '../../filters/filter-group';
import FilterKey from '../../filters/filter-keys';

import { ISaveParams } from '../save-bar/save-params';

import {
    EffectImageEventMap,
    EffectImageEventType,
    EffectImageSizeChange,
    EffectImageFilterChange
} from './EventMappings';

import { PreviewImage, PreviewImageEventMap } from '../preview-image/index';

import { drawImgRotated } from '../../utils';

import { saveAs } from 'file-saver';

/* for filters to be correctly applied to canvas contexts in IOS */
import 'context-filter-polyfill';

export class EffectImage extends PreviewImage {

    #scaleWidth: number = 1;
    #scaleHeight: number = 1;

    #flipH: string = '';
    #flipV: string = '';

    #filters: FilterGroup = new FilterGroup();

    #lockAspectRatio: boolean = false;

    #loaded = false;

    addEventListener<K extends keyof EffectImageEventMap>(type: K, listener: (this: Element, ev: EffectImageEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;

    /* fallback definition for default events */
    addEventListener(type: keyof PreviewImageEventMap, listener: (this: Element, ev: Event) => any, options?: boolean | AddEventListenerOptions): void {

        super.addEventListener(type, listener, options);
    }

    constructor() {

        super();
    }

    connectedCallback(): void {

        super.connectedCallback();

        this.img.style.rotate = '0deg';
        this.style.backgroundColor = 'transparent';
    }

    adjustHeight(perc: number): void {

        this.#scaleHeight = perc;

        if (this.#lockAspectRatio) {
            this.#scaleWidth = perc;
        }

        this.#updateScale();
    }

    adjustWidth(perc: number): void {

        this.#scaleWidth = perc;

        if (this.#lockAspectRatio) {
            this.#scaleHeight = perc;
        }

        this.#updateScale();
    }

    applyFilter(key: FilterKey, amt: number): void {

        if (!this.#filters.applyFilter(key, amt)) {
            return;
        }

        this.img.style.filter = this.#filters.filterStyle;

        this.dispatchEvent(new CustomEvent('change', {
            detail: {
                type: EffectImageEventType.filter,
                appliedFilter: key,
                name: this.name,
                style: this.#filters.filterStyle,
                filterValue: this.#filters.getFilterValue(key)
            } as EffectImageFilterChange
        }));
    }

    applyZoom(zoom: number): void {

        super.applyZoom(zoom);

        this.img.style.scale = `${this.#flipH}${this.zoom} ${this.#flipV}${this.zoom}`;
    }

    flipHorizontally(): void {

        this.#flipH = this.#flipH.length === 0 ? '-' : '';
        this.img.style.scale = `${this.#flipH}${this.zoom} ${this.#flipV}${this.zoom}`;
    }

    flipVertically(): void {

        this.#flipV = this.#flipV.length === 0 ? '-' : '';
        this.img.style.scale = `${this.#flipH}${this.zoom} ${this.#flipV}${this.zoom}`;
    }

    isFlippedH(): boolean { return this.#flipH === '-'; }
    
    isFlippedV(): boolean { return this.#flipV === '-'; }

    removeFilter(key: FilterKey): void {

        this.#filters.removeFilter(key);
        this.img.style.filter = this.#filters.filterStyle;
    }

    resetBgColor(): void {

        this.style.backgroundColor = 'transparent';
    }

    resetRotation(): void {

        this.img.style.removeProperty('rotate');

        this.#updateScale();
    }

    resetHeight(): void {

        this.#scaleHeight = 1;

        if (this.#lockAspectRatio) {
            this.#scaleWidth = 1;
        }

        this.#updateScale();
    }

    resetWidth(): void {

        this.#scaleWidth = 1;
        if (this.#lockAspectRatio) {
            this.#scaleHeight = 1;
        }

        this.#updateScale();
    }

    rotate(deg: number): void {

        this.img.style.rotate = `${deg}deg`;

        this.#updateScale();
    }

    setBgColor(color: string): void {

        this.style.backgroundColor = color;
    }

    setImageSource(src: string, name: string = '', altText: string = ''): void {

        super.setImageSource(src, name, altText);

        this.addEventListener('load', _ => {

            this.#loaded = true;

            this.#updateScale();

        }, { once: true });
    }

    toggleAspectRatio(): void {

        this.#lockAspectRatio = !this.#lockAspectRatio;
    }

    #updateScale(): void {

        this.img.style.width = `${Math.max(1, this.img.naturalWidth * this.#scaleWidth)}px`;
        this.img.style.height = `${Math.max(1, this.img.naturalHeight * this.#scaleHeight)}px`;

        this.syncOuterLayer();

        this.realignImg();

        /* only dispatch change events if this component has already loaded */
        this.#loaded &&
            this.dispatchEvent(new CustomEvent('change', {
                detail: {
                    type: EffectImageEventType.size,
                    name: this.name,
                    height: this.height,
                    width: this.width,
                    rotation: parseFloat(this.img.style.rotate)
                } as EffectImageSizeChange
            }));
    }

    writeToFile(params: ISaveParams): void {

        if (!this.#loaded) {
            throw Error('An image must first be loaded before saving.');
        }

        const canvas = document.createElement('canvas');
        canvas.width = this.width;
        canvas.height = this.height;

        const context = canvas.getContext('2d')!;

        context.fillStyle = this.bgColor;
        context.fillRect(0, 0, canvas.width, canvas.height);

        context.filter = this.filters;

        drawImgRotated(
            context,
            this.img,
            this.imgXOffset,
            this.imgYOffset,
            this.img.width,
            this.img.height,
            this.rotation,
            this.isFlippedH(),
            this.isFlippedV()
        );

        const source = canvas.toDataURL('image/' + params.type, params.quality);

        saveAs(source, params.filename);
    }

    get bgColor(): string { return this.style.backgroundColor; }
    set bgColor(bgColor: string) { this.bgColor = bgColor; }
    get filters(): string { return this.#filters.filterStyle; }
    get loaded(): boolean { return this.#loaded; }
    get lockAspectRatio(): boolean { return this.#lockAspectRatio; }
    get rotation(): number { return parseFloat(this.img.style.rotate); }
    get scaleWidth(): number { return this.#scaleWidth; }
    get scaleHeight(): number { return this.#scaleHeight; }
    get imgXOffset(): number { return (this.width - this.img.width) * .5; }
    get imgYOffset(): number { return (this.height - this.img.height) * .5; }
}

window.customElements.define('effect-image', EffectImage);