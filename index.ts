import * as PIXI from 'pixi.js';

import Engine from './src/engine';
import Component from './src/component';

import Components from './src/components/components';
import Systems from './src/systems/systems';
import Utils from './src/utils/utils';

export * from './src/components/camera';
export * from './src/components/html-wrapper';
export * from './src/components/mover';
export * from './src/components/sleepSystem';
export * from './src/components/spriteTiler';
export * from './src/components/timeDestroy';

export * from 'src/utils/canvas-draw';
export * from 'src/utils/types';
export * as DisplayUtils from 'src/utils/displayUtils';
export * as ColorUtils from 'src/utils/colorUtils';
export * as DrawUtils from 'src/utils/drawUtils';
export * as RandUtils from 'src/utils/rand';

import Factory from './src/factory';
import GameObject from './src/gameObject';
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
	Engine, Game, Component, System, Factory, GameObject, Library, Group,
	LoadGroup, Geom, Rand, Systems
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