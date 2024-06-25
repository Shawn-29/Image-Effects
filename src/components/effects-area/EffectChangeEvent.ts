import { IEffectEventParams } from './IEffectEventParams';

export default class EffectChangeEvent extends Event {
    params: IEffectEventParams;
    constructor(params: IEffectEventParams) {
        super('effectChange');
        this.params = params;
    }
}