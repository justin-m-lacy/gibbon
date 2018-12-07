/**
 * Basic Skin and UI Components for UI prototyping.
 */
import * as PIXI from 'pixi.js';
import {Graphics} from 'pixi.js';
import UiSkin from './uiSkin';

export function MakeSkin( opts=null ){

	let skin = new UiSkin( opts );

	console.log('skin created');
	skin.smallStyle = {

		fontFamily:skin.fontFamily||'',
		fontSize:skin.smallSize||12,
		fill:skin.fontColor||0
	}

	console.log('small style set');

	let foreColor = opts.foreColor || 0x444444;
	let backColor = opts.backColor || 0xfefefe;

	addCross( skin, 'cross', 24, 12, foreColor );
	addRoundRect( skin, 'box', 32, backColor, foreColor );
	addCheck( skin, 'check', 32, 12, foreColor )
	addFrame( skin, 64, 4, backColor, foreColor );
	addBar( skin, 128, 32, foreColor );

	console.log('items added');

	UiSkin.SetDefaultSkin( skin );


	return skin;

}

function addBar( skin, width=128, height=32, foreColor=0 ) {

	let g = new Graphics();
	g.beginFill( foreColor );
	g.lineStyle( 1, foreColor );
	g.drawRoundedRect( 0, 0, width, height, (width+height)/10 );
	g.endFill();

	let tex = skin.addAsTexture( 'bar', g );

	g.destroy();

	return tex;

}

function addFrame( skin, size=64, thickness=4, backColor=0, foreColor=0xffffff ) {

	let g = new Graphics();
	g.beginFill( backColor );
	g.lineStyle( thickness, foreColor );
	g.drawRoundedRect( 0, 0, size, size, size/10 );
	g.endFill();

	let tex = skin.addAsTexture( 'frame', g );

	g.destroy();

	return tex;

}

function addCheck( skin, key, size=32, thickness=8, color=0) {

	let g = new Graphics();
	g.lineStyle( thickness, color );

	g.moveTo( -0.45*size, 0 );
	g.lineTo( 0, 0.40*size );
	g.lineTo( 0.54*size, -0.58*size );

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