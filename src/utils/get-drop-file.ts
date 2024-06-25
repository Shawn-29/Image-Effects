import cancelDefaultDragAction from './cancel-drag-action';

/**
 * Constructs a File from object data provided by a Drop Event.
 * 
 * @param e
 *
 * @returns A Promise that resolves with a constructed File object.
 */
const getDropFile = async (e: DragEvent): Promise<File> => {

    return new Promise((resolve, reject) => {

        cancelDefaultDragAction(e);

        const file = e.dataTransfer?.files.item(0);

        if (!(file instanceof File)) {
            reject('Could not get dropped file!');
        }

        const fileReader = new FileReader();

        fileReader.readAsDataURL(file);
        fileReader.addEventListener('loadend', () => {

            resolve(file);

        }, { once: true });
    });
};

export default getDropFile;