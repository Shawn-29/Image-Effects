/**
 * Synchronously creates and then returns a CSS style sheet resource from
 * provided text.
 * 
 * @param cssText - Text to create the CSS style sheet from.
 */
const createStyleSheet = (cssText: string) : CSSStyleSheet => {
    
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(cssText);
    return sheet;
};

export default createStyleSheet;