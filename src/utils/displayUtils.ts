import type { DisplayObject } from 'pixi.js';
/**
 * 
 * @param {DisplayObject} clip 
 */
export const moveTop = (clip: DisplayObject) => {

	if (clip.parent) {
		clip.parent.setChildIndex(clip, clip.parent.children.length - 1);
	}

}