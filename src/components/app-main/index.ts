import markup from 'bundle-text:./index.html';
import styles from 'bundle-text:./styles.css';

import { createTemplate, createStyleSheet, DragEventHandler, getDropFile } from '../../utils';

import { ISaveParams } from '../save-bar/save-params';

import { effectsMap, EffectParams } from '../../effects-map';

import EffectChangeEvent from '../effects-area/EffectChangeEvent';

/* components */
import { PreviewImage } from '../preview-image';
import { EffectImage } from '../effect-image';
import PageOverlay from '../page-overlay';
import ErrorDialog from '../error-dialog';
import SaveBar from '../save-bar';
import ZoomBar from '../zoom-bar';
import { EffectsArea } from '../effects-area';
import rafTimeout from '../../utils/raf-timeout';

/* image types allowed to be uploaded or dropped onto the app by the user */
const allowedImgTypes = new Set([
    'png', 'jpg', 'jpeg',
    'gif', 'svg+xml', 'bmp',
    'webp'
]);

class AppMain extends HTMLElement {

    #shadowRoot: ShadowRoot;

    #originalImg: PreviewImage;
    #newImg: EffectImage;

    #overlay: PageOverlay;
    #errorDialog: ErrorDialog;

    #saveBar: SaveBar;
    #zoomBar: ZoomBar;

    constructor() {

        super();

        this.#shadowRoot = this.attachShadow({ mode: 'closed' });
        this.#shadowRoot.appendChild(createStyleSheet(styles));
        this.#shadowRoot.appendChild(createTemplate(markup).content);

        const dropHandler = new DragEventHandler();

        /* add event listeners for drag and drop events */
        dropHandler.onEnter = _ => this.#overlay.show('Drop a GIF, PNG, JPG, BMP, or SVG image.');
        dropHandler.onLeave = _ => this.#overlay.hide();
        dropHandler.onDrop = this.handleFileDrop.bind(this);
    }

    connectedCallback(): void {

        this.#originalImg = this.#shadowRoot.querySelector('preview-image')!;
        this.#newImg = this.#shadowRoot.querySelector('effect-image')!;

        this.#overlay = document.body.querySelector('page-overlay')!;
        this.#errorDialog = document.body.querySelector('error-dialog')!;

        this.#saveBar = this.#shadowRoot.querySelector('save-bar')!;
        this.#zoomBar = this.#shadowRoot.querySelector('zoom-bar')!;

        this.#shadowRoot.querySelector('input[type="file"]')!.
            addEventListener('change', this.getFileUpload.bind(this));

        (<EffectsArea>this.#shadowRoot.querySelector('effects-area'))!.
            addEventListener('effectChange', this.effectChange.bind(this));

        this.#saveBar.setSaveHandler(this.handleFileSave.bind(this));

        this.#zoomBar.addEventListener('change', this.applyImgZoom.bind(this));

        /* remove the page cover once the app has loaded */
        window.addEventListener('load', _ => {
            const pageCover = document.getElementById('page-cover') as
                HTMLElement | null;
            if (pageCover) {
                const animFade = new Animation(new KeyframeEffect(
                    pageCover, [{ opacity: 1 }, { opacity: 0 }],
                    { duration: 1500, fill: 'forwards', iterations: 1 }
                ));
                animFade.onfinish = () => document.body.removeChild(pageCover);
                rafTimeout(750, () => animFade.play());
            }
        }, { once: true });
    }

    applyImgZoom(e: CustomEvent<{ zoomLevel: number }>): void {

        const zoomAmount = e.detail.zoomLevel * .01;
        this.#originalImg.applyZoom(zoomAmount);
        this.#newImg.applyZoom(zoomAmount);
    }

    effectChange(e: EffectChangeEvent): void {

        const { effectKey, value, reset } = e.params;

        this.runEffect(effectKey, {
            value, reset, img: this.#newImg
        });
    }

    getFileUpload(e: Event): void {

        try {
            const file = (<HTMLInputElement>e.target).files?.item(0);
            file instanceof File && this.setImg(file);
        } catch (e) {
            this.#errorDialog.show((<Error>e).message);
        }
    }

    async handleFileDrop(e: DragEvent): Promise<void> {

        try {
            const file = await getDropFile(e);
            this.setImg(file);
        } catch (error) {
            this.#errorDialog.show(String(error));
        }

        this.#overlay.hide();
    }

    handleFileSave(params: ISaveParams): void {

        try {
            this.#newImg.writeToFile(params);
        } catch (error) {
            this.#errorDialog.show((<Error>error).message);
        }
    }

    runEffect(effectKey: string, params: EffectParams): void {

        effectsMap.get(effectKey)?.(params);
    }

    setImg(file: File): void {

        if (!allowedImgTypes.has(file.type.slice(file.type.indexOf('/') + 1))) {
            throw new TypeError('Invalid file type. Expected GIF, PNG, JPG, BMP, or SVG.');
        }

        if (file.size >= 2000000) {
            this.#errorDialog.show('WARNING! Larger files can take longer to manipulate and save.',
                { type: 'warning' }
            );
        }

        const imgURL = URL.createObjectURL(file);

        this.#originalImg.setImageSource(imgURL, file.name);
        this.#newImg.setImageSource(imgURL, file.name);
    };
}


window.customElements.define('app-main', AppMain);

export default AppMain;