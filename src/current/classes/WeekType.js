import appDb from '../../shared/indexedDb/mainDb';
import { Setting } from './Setting';

class WeekTypeClass {
	constructor() {
		this.types = [];
	}
}

WeekTypeClass.prototype.loadAll = async function () {
	this.types.length = 0;

	const appData = await appDb.week_type.reverse().reverse().sortBy('id_week_type');

	for (const item of appData) {
		const obj = {};
		obj.id_week_type = item.id_week_type;
		obj.week_type_name = item.week_type_name;
		obj.sort_index = item.sort_index;
		this.types.push(obj);
	}
};

WeekTypeClass.prototype.local = function () {
	const newList = [];
	this.types.forEach((weekType) => {
		const obj = {};
		obj.value = weekType.id_week_type;
		obj.sort_index = weekType.sort_index;
		obj.label = weekType.week_type_name[Setting.source_lang.toUpperCase()];
		newList.push(obj);
	});

	newList.sort((a, b) => {
		return a.sort_index > b.sort_index ? 1 : -1;
	});

	return newList;
};

WeekTypeClass.prototype.getLabel = function (type) {
	const data = this.local();
	const weekTypeName = data.find((item) => item.value === type).label;
	return weekTypeName.toUpperCase();
};

export const WeekTypeList = new WeekTypeClass();
