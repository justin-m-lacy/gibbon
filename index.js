import Engine from './src/engine';
import Component from './src/component';
import Factory from './src/factory';
import GameObject from './src/gameObject';
import Mover from './src/components/mover';
import Camera from './src/components/camera';
import SpriteTiler from './src/components/spriteTiler';
import Library from './src/library';
import Game from './src/game'

export {Engine, Component, Factory, GameObject, Mover, Camera, SpriteTiler, Library };

const Gibbon = {

	Engine,
	Game,
	Component,
	GameObject,
	Factory,
	Library,
	Camera,
	Mover,
	SpriteTiler

}
export default Gibbon;