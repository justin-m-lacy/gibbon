export default class Button {

	get onClick() {return this._click;}
	set onClick(v) {this._click=v;}

	constructor( clip ){

		this.clip = clip;
		this.clip.on('pointerup',
			()=> this._click ? this._click() : null );

	}

	destroy() {
		this.clip.destroy(true);
		this._click = null;
		this.clip = null;
	}

}