import Engine from './src/engine';
import Component from './src/component';
import Factory from './src/factory';
import GameObject from './src/gameObject';
import Mover from './components/mover';
import Camera from './components/camera';
import Library from './src/library';
import Game from './src/game'

export {Engine, Game, Component, Factory, GameObject, Mover, Camera, Library };

const Gibbon = {

	Engine,
	Game,
	Component,
	GameObject,
	Factory,
	Library,
	Camera,
	Mover

}
export default Gibbon;