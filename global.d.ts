/* ignore 'module not found' errors when importing modules via Parcel imports */
declare module 'bundle-text:*.css' {
    const css: string;
    export default css;
}
declare module 'bundle-text:*.html' {
    const html: string;
    export default html;
}