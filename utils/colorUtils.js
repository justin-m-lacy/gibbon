export default {

	rgbStr:(color)=>{
		return color.toString(16).padStart(6,'0');
	},

	htmlStr:(color)=>{
		return '#'+color.toString(16).padStart(6,'0');
	}

}