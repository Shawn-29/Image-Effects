/**
 * Creates an HTML template element with markup from a given string.
 * 
 * @param innerHTML 
 */
const createTemplate = (innerHTML: string): HTMLTemplateElement => {
    
    const template = document.createElement('template');
    template.innerHTML = innerHTML;
    return template;
};

export default createTemplate;