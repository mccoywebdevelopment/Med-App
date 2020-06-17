var _dash = require('lodash');

function validator(model,body,callback){
	var nestedFields = getRequiredKeys(model);
	var requriedFields = getLastField(nestedFields);
	var myKeys = [];
	var clientProps = getNode(body,myKeys);

	var errors = [];
	for(var i=0;i<requriedFields.length;++i){
		var found = false;
		for(var ix=0;ix<clientProps.length;++ix){
			if(clientProps[ix]==requriedFields[i]){
				found = true;
			}
		}
		if(!found){
			errors.push("Missing value for the required field:"+requriedFields[i]+" of the model:"+model.collection.name+"!");
		}
	}
	if(errors.length>0){
		callback(errors);
	}else{
		callback(null,"success");
	}
}



function getNode(node,myKeys){
    if(node == null)
        return null;
    if(typeof node !== 'object'){
        return [node];
    }
    var arr = [];
    var array_node = Object.keys(node).map(function(key) { 
		if(typeof(node[key])!='object'){
			myKeys.push(key);
		}
		return node[key] 
	});
    for( var i = 0; i < array_node.length ; i ++){
        Array.prototype.push.apply(arr, getNode(array_node[i],myKeys));
    }
    return myKeys;
 }


function getRequiredKeys(model){
	var arr = [];
	var objModel = model.schema.obj;
	var props = Object.keys(model.schema.paths);
	for(var i=0;i<props.length;++i){
		if(typeof(_dash.get(objModel,props[i]))!='undefined' && _dash.get(objModel,props[i]).hasOwnProperty('required')){
			arr.push(props[i])
		}
	}
	return arr;
}
function getLastField(arr){
	var newArr = [];
	for(var i=0;i<arr.length;++i){
		var secArr = arr[i].split(".");
		newArr.push(secArr[secArr.length-1]);
	}
	return newArr;
}

/**
 * 
 * @param {*} fields - the optional fields
 * @param {*} data - the object that might have the optional fields
 * @param {*} newData - the validation object that will be modified 
 *          and returned with the optional fields attached. It should 
 *          either be {} or be {data: Object}
 */
function validOptional(fields, data, newData) {
	if (!newData.data) {
		newData.data = {};
	}
	for(let i = 0; i < fields.length; i++) {
		newData.data[fields[i]] = data[fields[i]]
	}

	if(newData.valid !== undefined) {
		newData.valid = newData.valid && true;	
	} else {
		newData.valid = true;
	}

	return newData;
}

/**
 * 
 * @param {*} fields - the required fields 
 * @param {*} data - the object being validated for having the fields
 * @param {*} newData - the validation object that will be modified and returned.
 * 			It should either be {} or be {data: Object}
 */
function validRequired(fields, data, newData) {
	if(!newData.data) {
		newData.data = {};
	}
	for(let i = 0; i < fields.length; i++) {
		let field = fields[i]
		let fval = data[field]
		if(fval === undefined || fval === null) {
			newData.fields = [field]
			newData.valid = false;
			return newData;
		}

		newData.data[field] = fval;
	}

	if(newData.valid !== undefined) {
		newData.valid = newData.valid && true;	
	} else {
		newData.valid = true;
	}

	return newData;
}

function errIfUndefinedFields(fields, obj) {
	for(let i = 0; i < fields.length; i++) {
		if(obj[fields[i]] === undefined) {
			throw new Error("field was undefined");
		}
	}
}

/**
 * 
 * @param {*} validatedData the data outputted by validRequired
 *                  or validOptional, of the form { data: Object, valid: Bool }
 */
function errIfInvalidElseData(validatedData) {
	errIfUndefinedFields(["valid", "data"], validatedData);

	if(!validatedData.valid) {
		throw new Error("Error on fields: " + validatedData.fields);
	}

	return validatedData.data;
}

module.exports = {
	getLastField,
	getRequiredKeys,
	validator,
	validOptional,
	validRequired,
	errIfInvalidElseData,
}