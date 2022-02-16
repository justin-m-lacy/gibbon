import * as PIXI from 'pixi.js';

import Engine from './src/engine';
import Component from './src/component';

import Components from './src/components/components';
import Systems from './src/systems/systems';
import Utils from './src/utils/utils';

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

export * from 'src/components/components';
export * from './src/utils/utils';

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