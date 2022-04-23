import * as PIXI from 'pixi.js';

import Engine from './src/engine';
import Component from './src/component';

import Components from './src/components/components';
import Systems from './src/systems/systems';
import Utils from './src/utils/utils';

import HtmlWrapper from './src/components/html-wrapper';
import SleepSystem from './src/components/sleepSystem';
import SpriteTiler from './src/components/spriteTiler';
import TimeDestroy from './src/components/timeDestroy';

export { isClonable, isConstructor, } from './src/utils/types';
export type { Clonable, Constructor } from './src/utils/types';
import * as DisplayUtils from './src/utils/displayUtils';
import * as ColorUtils from './src/utils/colorUtils';
import * as DrawUtils from './src/utils/drawUtils';
import * as RandUtils from './src/utils/rand';
import { tweenOf, getTween, removeTween } from 'src/utils/tweens';
export { IPoint } from './src/game-object';

import Factory from './src/factory';
import GameObject from './src/game-object';
import DestAccel from 'src/components/dest-accel';
import Mover from './src/components/mover';
import Camera from './src/components/camera';
import Library from './src/library';
import Game from './src/game'
import Group from './src/group';
import System from './src/system';
import LoadGroup from './src/loadGroup';
import * as Geom from './src/utils/geom';
import * as Rand from './src/utils/rand';
import CanvasDraw from './src/utils/canvas-draw';

export {
	Engine, Game, Component, System, Factory,
	GameObject,
	Library,
	Group,
	LoadGroup,
	Geom,
	Rand,
	Systems,
	HtmlWrapper,
	SleepSystem,
	SpriteTiler,
	TimeDestroy,
	DisplayUtils,
	RandUtils,
	ColorUtils,
	CanvasDraw,
	Mover,
	DrawUtils,
	DestAccel,
	getTween,
	tweenOf,
	removeTween
};

const Gibbon = {

	CanvasDraw,
	Components,
	Systems,
	Utils,
	Geom,
	Engine,
	System,
	Game,
	Group,
	LoadGroup,
	Component,
	GameObject,
	Factory,
	Library,
	Camera,
	Mover,
	Rand

}
export default Gibbon;