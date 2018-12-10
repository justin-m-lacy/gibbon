import CounterField from './counterFld';
import UiSkin from './uiSkin';
import ProgressBar from './progressBar';
import Checkbox from './checkbox';

const Flow = {
	VERTICAL:1,
	HORIZONTAL:2
};

const Anchors = {

	TOP:1,
	BOTTOM:2,
	LEFT:4,
	RIGHT:8,
	CENTER:16,

};

export { Checkbox, UiSkin, ProgressBar, CounterField, Anchors, Flow };

export default {

	ProgressBar,
	UiSkin,
	CounterField,
	Checkbox,
	Anchors

};