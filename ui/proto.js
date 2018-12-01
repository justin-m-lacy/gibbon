/**
 * Basic Skin and UI Components for UI prototyping.
 */
import * as PIXI from 'pixi.js';
import Skin from './uiSkin';

export function MakeSkin( foreColor=0x444444, backColor=0xfefefe ){

	let skin = new Skin();

	addCross( skin, 'cross', 24, 8, foreColor );
	addRoundRect( skin, 'box', 32, backColor, foreColor );
	addCheck( skin, 'check', 32, thickness, foreColor )

	Skin.SetDefaultSkin( skin );

	return skin;

}

function addCheck( skin, key, size=32, thickness=8, color=0) {

	let g = new Graphics();
	g.lineStyle( thickness, color );

	g.moveTo( -0.45*size, -size/10 );
	g.lineTo( 0, 0.48*size );
	g.lineto( 0.54*size, 0.58*size );

	let tex = skin.addAsTexture( key, g );
	g.destroy();

	return tex;

}

function addCross( skin, key, size=32, thickness=8, color=0 ) {

	let g = new Graphics();
	g.lineStyle( thickness, color );
	g.moveTo( 0, 0 );
	g.lineTo( size, size );
	g.moveTo( size, 0 );
	g.lineTo( 0, size );

	let tex = skin.addAsTexture( key, g );
	g.destroy();

	return tex;

}

function addRoundRect( skin, key, size=32, fillColor=0xffffff, lineColor=0 ) {

	let g = new Graphics();
	g.beginFill( fillColor );
	g.lineStyle( 2, lineColor );
	g.drawRoundedRect( 0, 0, size, size, 4 );
	g.endFill();

	let tex = skin.addAsTexture( key, g );

	g.destroy();

	return tex;

}