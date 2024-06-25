import { cancelDefaultDragAction } from './';

export type dragEvent = (e: DragEvent) => void;

/**
 * Helper class to modularize drag and drop event handling.
 */
export class DragEventHandler {

    #isDragging: boolean = false;

    /**
     * Event handler when a dragged element enters another element.
     * @param e - Override this event handler with your own if needed.
     */
    onEnter: dragEvent = (e: DragEvent): void => { };

    /**
     * Event handler when a dragged element leaves another element.
     * @param e - Override this event handler with your own if needed.
     */
    onLeave: dragEvent = (e: DragEvent): void => { };

    /**
     * Event handler when a dragged element is dropped onto another element.
     * @param e - Override this event handler with your own if needed.
     */
    onDrop: dragEvent = (e: DragEvent): void => { };

    constructor() {

        document.documentElement.addEventListener('dragenter', (e: DragEvent) => {

            if (this.#isDragging)
                return;

            this.#isDragging = true;

            this.onEnter(e);
        }, { capture: false });

        document.documentElement.addEventListener('dragleave', (e: DragEvent) => {

            if (this.#isDragging && e.relatedTarget === null) {
                this.#isDragging = false;

                this.onLeave(e);
            }
        });

        document.body.addEventListener('drop', (e: DragEvent) => {

            cancelDefaultDragAction(e);

            this.#isDragging = false;

            this.onDrop(e);
        });

        document.body.addEventListener('dragover', cancelDefaultDragAction);
    }
}