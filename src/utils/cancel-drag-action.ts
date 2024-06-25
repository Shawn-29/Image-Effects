/**
 * Prevent a Drag Event's default behavior.
 * 
 * @param e
 */
const cancelDefaultDragAction = (e: DragEvent): void => {
    
    e.preventDefault();
    e.stopPropagation();
};

export default cancelDefaultDragAction;