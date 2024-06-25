/**
 * Draws a rotated, scaled image at a specified position to a 2D rendering
 * context.
 * 
 * @param ctx
 * 
 * @param image Image to draw to the drawing context.
 * 
 * @param x Left coordinate to draw image.
 * 
 * @param y Top coordinate to draw image.
 * 
 * @param w Width in pixels to draw image.
 * 
 * @param h Height in pixels to draw image.
 * 
 * @param degs Rotation in degrees to draw image.
 */
const drawImgRotated = (
	
	ctx: CanvasRenderingContext2D,
	image: HTMLImageElement,
	x: number,
	y: number,
	w: number,
	h: number,
	degs: number,
	flipH: boolean = false,
	flipV: boolean = false): void => {
	ctx.save();
	ctx.translate(x + w * .5, y + h * .5);
	ctx.rotate(degs * (Math.PI / 180));
	ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
	ctx.translate(-x - w * .5, -y - h * .5);
	ctx.drawImage(image, x, y, w, h);
	ctx.restore();
};

export default drawImgRotated;