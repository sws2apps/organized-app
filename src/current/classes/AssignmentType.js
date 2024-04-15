import appDb from '../../shared/indexedDb/mainDb';
import { Setting } from './Setting';

class AssignmentTypeClass {
	constructor() {
		this.types = [];
	}
}

AssignmentTypeClass.prototype.loadAll = async function () {
	const appData = await appDb.assignment.reverse().sortBy('code');

	for (const item of appData) {
		const obj = {};
		obj.code = item.code;
		obj.assignable = item.assignable;
		obj.assignment_type_name = item.assignment_type_name;
		obj.maleOnly = item.maleOnly || false;
		obj.type = item.type;
		obj.linkTo = item.linkTo;
		this.types.push(obj);
	}
};

AssignmentTypeClass.prototype.local = function () {
	const newList = [];
	for (const type of this.types) {
		const obj = {};
		obj.value = type.code;
		obj.label = type.assignment_type_name[Setting.source_lang.toUpperCase()];
		obj.assignable = type.assignable;
		obj.maleOnly = type.maleOnly;
		obj.type = type.type;
		obj.linkTo = type.linkTo;
		newList.push(obj);
	}
	return newList;
};

AssignmentTypeClass.prototype.AYFOnly = function () {
	const newList = this.local()
		.filter((ass) => ass.type === 'ayf' && ass.label !== undefined && ass.label !== '')
		.sort((a, b) => {
			return a.code > b.code ? 1 : -1;
		});

	const final = newList.map((list) => {
		return { label: list.label, value: list.value };
	});

	return final;
};

export const AssignmentType = new AssignmentTypeClass();
