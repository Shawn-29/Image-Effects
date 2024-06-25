import FilterKey from '../../filters/filter-keys';
import { PreviewImageEventMap } from '../preview-image';

import { EffectImgProps } from './EffectImgProps';

export const enum EffectImageEventType { 'size', 'filter' };

export interface EffectImageSizeChange {
    /** The type of change that occurred on the component. */
    type: EffectImageEventType.size,
    /** Component's current height in pixels. */
    height: number,
    /** Component's current width in pixels. */
    width: number,
    /** The name property of the component. */
    name: string,
    /** Component's current rotation in degrees. */
    rotation: number
}

export interface EffectImageFilterChange {
    /** The type of change that occurred on the component. */
    type: EffectImageEventType.filter,
    /** The applied filter's key. */
    appliedFilter: FilterKey,
    /** The new filter value. */
    filterValue: string,
    /** The name property of the component. */
    name: string,
    /** The new CSS filter style. */
    style: string
}

export type EffectImageEvent = EffectImageSizeChange | EffectImageFilterChange;

export interface EffectImageEventMap extends PreviewImageEventMap {
    'change': CustomEvent<EffectImageEvent>
}