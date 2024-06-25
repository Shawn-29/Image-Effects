import Colors from './Colors';

import getColorContrast from './get-color-contrast';

/**
 * Inverts the color values in a CSS hexadecimal style color string. Supports
 * "#rgb", "#rrggbb", "#rgba", and "#rrggbbaa" formats.
 * 
 * @param hexStyle The CSS color to invert.
 * 
 * @param increaseContrast Whether the contrast between the inverted string the original should be increased.
 * 
 * @returns The inverted CSS color string.
 */
const invertHexStyle = (hexStyle: string, increaseContrast: boolean = false): string => {

    if (!/^#(?=[a-zA-Z0-9]*$)(.{3,4}|.{6}|.{8})$/.test(hexStyle)) {
        throw Error('Hexadecimal style string must be in either "#rgb", "#rrggbb", "#rgba", or "#rrggbbaa" format.');
    }

    let hexString = hexStyle.substring(1);
    const nColorDigits = hexString.length;

    /* expand the string if it was written in shorthand */
    if (nColorDigits < 6) {
        hexString = hexString.split('').map(char => char + char).join('');
    }

    /* remove alpha values if they exist so they aren't inverted */
    const alphaChars = hexString.slice(6);

    /* parse the hex string into numbers */
    const hexDigits = parseInt(hexString.substring(0, 6), 16);

    /* get individual color values */
    const r = (hexDigits >>> 16) & 0xff,
        g = (hexDigits >>> 8) & 0xff,
        b = hexDigits & 0xff;

    const regColors: Colors = [r, g, b];
    const invColors: Colors = <Colors>regColors.map(c => c ^ 0xff);

    if (increaseContrast) {
        const contrast = getColorContrast(regColors, invColors);
        if (Math.abs(contrast) < 4) {

            /* colors should be lightened */
            if (contrast < 0) {
                invColors.forEach((_, i) => invColors[i] = Math.min(invColors[i] + 160, 255));
            }
            /* colors should be darkened */
            else {
                invColors.forEach((_, i) => invColors[i] = Math.max(invColors[i] - 160, 0));
            }
        }
    }

    /* return the inverted colors as a CSS style string */
    return '#' + invColors.map(c => c.toString(16).padStart(2, '0')).join('') + alphaChars;
};

export default invertHexStyle;