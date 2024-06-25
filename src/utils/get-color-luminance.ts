import Colors from './Colors';

const getChannelValue = (color: number): number => {
    const chan = color / 255;
    return (chan <= 0.04045) ? chan / 12.92 : ((chan + 0.055) / 1.055) ** 2.4;
};

/**
 * Returns a color's relative luminance. Formula source:
 * https://www.w3.org/TR/WCAG20/#relativeluminancedef.
 *
 * @param colors 
 */
const getColorLuminance = (colors: Colors): number => {

    return 0.2126 * getChannelValue(colors[0]) + 0.7152 *
        getChannelValue(colors[1]) + 0.0722 *
        getChannelValue(colors[2]);
}

export default getColorLuminance;