import type { DisplayObject } from 'pixi.js';

/**
 * Move clip to the top of its parent's display list.
 * @param clip 
 */
export const moveTop = (clip: DisplayObject) => {

	clip.parent?.setChildIndex(clip, clip.parent.children.length - 1);

}