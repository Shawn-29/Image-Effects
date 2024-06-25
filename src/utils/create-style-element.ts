/**
 * Creates and returns a CSS style element from a provided style string.
 * 
 * @param cssText - Text to create the CSS style element from.
 */
const createStyleElement = (cssText: string) : HTMLStyleElement => {
    
    const styleElem = document.createElement('style');
    styleElem.innerHTML = cssText;
    return styleElem;
}

export default createStyleElement;