import Colors from './Colors';

import getColorLuminance from './get-color-luminance';

/**
 * Returns the color contrast of two colors. Returns value will be negative if
 * second color has greater luminance than the first.
 * 
 * @param colorA
 * 
 * @param colorB
 */
const getColorContrast = (colorA: Colors, colorB: Colors): number => {
    
    const colorALum = getColorLuminance(colorA),
        colorBLum = getColorLuminance(colorB);

    const contrast =  colorALum > colorBLum ?
        (colorALum + 0.05) / (colorBLum + 0.05) :
        -((colorBLum + 0.05) / (colorALum + 0.05));

    return contrast;
};

export default getColorContrast;