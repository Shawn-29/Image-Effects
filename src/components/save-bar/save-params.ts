export type saveTypes = 'jpeg' | 'png' | 'svg';

export interface ISaveParams {
    filename: string,
    type: saveTypes,
    quality: number
}

export type saveCallback = (params: ISaveParams) => void;