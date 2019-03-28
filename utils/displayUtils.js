/**
 * 
 * @param {DisplayObject} clip 
 */
export const moveTop = ( clip ) => {

	if ( !clip.parent ) return;
	clip.swap( clip.parent.children.length-1);

}