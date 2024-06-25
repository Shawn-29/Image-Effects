import styles from 'bundle-text:./styles.css';
import { createStyleSheet, createTemplate } from '../../utils';

const WORDS_PER_MIN = 275;

const countWords = (msg: string): number =>
    msg.match(new RegExp(/\w+/g))?.length ?? 0;

const getReadTimeMs = (msg: string): number => {

    const numWords = countWords(msg);
    const readTime = numWords / WORDS_PER_MIN;
    return readTime * 60000;
};

type styleTypeClass = 'error' | 'success' | 'warning';

interface ShowParams {
    type?: styleTypeClass,
    durationMs?: number
};

class ErrorDialog extends HTMLElement {

    #shadowRoot: ShadowRoot;

    #animMove: Animation;
    #animFade: Animation;
    #timerId: number = 0;

    #msgWrapper: HTMLElement;
    #msgTag: HTMLParagraphElement;

    constructor() {

        super();

        this.#shadowRoot = this.attachShadow({ mode: 'closed' });
        this.#shadowRoot.appendChild(createStyleSheet(styles));
        this.#shadowRoot.appendChild(
            createTemplate(`<article><p></p></article>`).content
        );

        this.#animMove = new Animation(new KeyframeEffect(
            this.#shadowRoot.host,
            {
                opacity: 1,
                transform: ['translate(-50%, 0)', 'translate(-50%, 150px)']
            },
            { duration: 200, fill: 'forwards', iterations: 1 }
        ));

        this.#animFade = new Animation(new KeyframeEffect(
            this.#shadowRoot.host,
            [
                { opacity: 1 }, { opacity: 0 }
            ],
            { duration: 200, fill: 'forwards', iterations: 1 }
        ));

        /* remove collision from this component when animations finish so it doesn't
            block input from elements beneath it */
        this.#animFade.onfinish = _ =>
            (<HTMLElement>this.#shadowRoot.host).style.display = 'none';

        /* make this component appear over other document elements */
        document.body.prepend(this);
    }

    connectedCallback() {
        
        this.#msgWrapper = this.#shadowRoot.querySelector('article')!;
        this.#msgTag = this.#shadowRoot.querySelector('p')!;
    }

    show(msg: string, { type = 'error', durationMs }: ShowParams = {}) {

        this.#msgWrapper.className = type;

        this.#msgTag.textContent = msg;

        /* cancel previous animations if they were running */
        this.#animMove.cancel();
        this.#animFade.cancel();

        /* clear previous delay timer */
        window.clearTimeout(this.#timerId);

        /* unhide the component */
        (<HTMLElement>this.#shadowRoot.host).style.display = 'block';

        this.#animMove.play();

        this.#animMove.onfinish = _ => {

            /* fade-out after waiting a specified duration */
            this.#timerId = window.setTimeout(() => {
                this.#animFade.play();
            }, Number.isFinite(durationMs) ?
                durationMs :
                /* if no duration is given, use an estimated read-time based
                   on the length of the message plus a small leeway */
                getReadTimeMs(msg) + 2550);
        };
    }
}

window.customElements.define('error-dialog', ErrorDialog);

export default ErrorDialog;