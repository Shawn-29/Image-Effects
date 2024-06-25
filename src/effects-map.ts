import { EffectImage } from './components/effect-image';

import { parseNum } from './utils';

import FilterKey from './filters/filter-keys';

export interface EffectParams {
    img: EffectImage
    value?: string,
    reset?: boolean
}

const blur = ({ img, value, reset }: EffectParams) => {
    reset ? img.removeFilter(FilterKey.BLUR) :
        img.applyFilter(FilterKey.BLUR, parseNum(value));
};

const brighten = ({ img, value, reset }: EffectParams) => {
    reset ? img.removeFilter(FilterKey.BRIGHTEN) :
        img.applyFilter(FilterKey.BRIGHTEN, parseNum(value));
};

const contrast = ({ img, value, reset }: EffectParams) => {
    reset ? img.removeFilter(FilterKey.CONTRAST) :
        img.applyFilter(FilterKey.CONTRAST, parseNum(value));
};

const grayscale = ({ img, value, reset }: EffectParams) => {
    reset ? img.removeFilter(FilterKey.GRAYSCALE) :
        img.applyFilter(FilterKey.GRAYSCALE, parseNum(value));
};

const hueRotate = ({ img, value, reset }: EffectParams) => {
    reset ? img.removeFilter(FilterKey.HUE_ROTATE) :
        img.applyFilter(FilterKey.HUE_ROTATE, parseNum(value));
};

const invert = ({ img, value, reset }: EffectParams) => {
    reset ? img.removeFilter(FilterKey.INVERT) :
        img.applyFilter(FilterKey.INVERT, parseNum(value));
};

const opacity = ({ img, value, reset }: EffectParams) => {
    reset ? img.removeFilter(FilterKey.OPACITY) :
        img.applyFilter(FilterKey.OPACITY, parseNum(value));
};

const saturate = ({ img, value, reset }: EffectParams) => {
    reset ? img.removeFilter(FilterKey.SATURATE) :
        img.applyFilter(FilterKey.SATURATE, parseNum(value));
};

const sepia = ({ img, value, reset }: EffectParams) => {
    reset ? img.removeFilter(FilterKey.SEPIA) :
        img.applyFilter(FilterKey.SEPIA, parseNum(value));
};

const rotateImage = ({ img, value, reset }: EffectParams) => {
    reset ? img.resetRotation() : img.rotate(parseNum(value));
};

const adjustImageWidth = ({ img, value, reset }: EffectParams) => {
    reset ? img.resetWidth() : img.adjustWidth(parseNum(value));
};

const adjustImageHeight = ({ img, value, reset }: EffectParams) => {
    reset ? img.resetHeight() : img.adjustHeight(parseNum(value));
};

const flipImageHorizontal = ({ img }: EffectParams) => {
    img.flipHorizontally();
};

const flipImageVertical = ({ img }: EffectParams) => {
    img.flipVertically();
};

const toggleAspectRatio = ({ img }: EffectParams) => {
    img.toggleAspectRatio();
};

const setBgColor = ({ img, value, reset }: EffectParams) => {
    reset ? img.resetBgColor() : img.setBgColor(value ?? 'transparent');
};

export const effectsMap: Map<string, (e: EffectParams) => void> = new Map([
    ['blur', blur],
    ['brighten', brighten],
    ['contrast', contrast],
    ['grayscale', grayscale],
    ['hueRotate', hueRotate],
    ['invert', invert],
    ['opacity', opacity],
    ['saturate', saturate],
    ['sepia', sepia],
    ['rotate', rotateImage],
    ['width', adjustImageWidth],
    ['height', adjustImageHeight],
    ['flipHorizontal', flipImageHorizontal],
    ['flipVertical', flipImageVertical],
    ['aspectRatio', toggleAspectRatio],
    ['bgColor', setBgColor]
]);