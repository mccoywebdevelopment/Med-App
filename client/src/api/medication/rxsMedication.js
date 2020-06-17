import variable from "../../config/variable";
import {jwt} from "../dependents/Dependents";

function rxsMedicationPatch(id,data,callback){
    var newData = {
        updatedFields:data
    }
    fetch(variable.api.baseURL+"/rxsMedication/"+id+"/"+jwt,{
        method:'PATCH',
        body: JSON.stringify(newData),
        headers: {
            'Content-Type': 'application/json',
        }
    }).then(response => response.json())
    .then(jsondata => callback(jsondata));
}
export {
    rxsMedicationPatch
}