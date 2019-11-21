export const rgbStr =(color)=>{
	return color.toString(16).padStart(6,'0');
};

export const htmlStr =(color)=>{
	return '#'+color.toString(16).padStart(6,'0');
};