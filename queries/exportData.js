var xl = require('excel4node');
let path = require('path');
let Dependent = require('../models/dependent/Dependent');
let MedicationEvent = require('../models/medicationEvent/MedicationEvent');
let Guardian = require('../models/guardian/Guardian');
let { formatAMPM, formatMMDDYYYY } = require('../config/globalHelpers');
let { getCurrentTime } = require('../config/rootHelpers');

function exportDataGivenMonthYear(month,year,callback){
    if(typeof(month)=='undefined' || month<0 || month>11){
        callback("Please enter a valid month");
    }
    Dependent.find({}).populate('rxsMedications').exec(function(err,res){
        if(err){
            callback(err);
        }else if(res.length<1){
            callback("No dependents found.");
        }else{
            MedicationEvent.populate(res,{path:'rxsMedications.events'},function(err,res){
                if(err){
                    callback(err);
                }else{
                    Guardian.populate(res,{path:'rxsMedications.events.createdBy'},function(err,res){
                        if(err){
                            callback(err);
                        }else{
                            writeData(month,year,res,function(err,result){
                                if(err){
                                    callback(err);
                                }else{
                                    callback(null,result);
                                }
                            });
                        }
                    });
                }
            });
        }
    });
}
function writeData(month,year,dependents,callback){
    var wb = new xl.Workbook();
    var counter = 0;
    dependents.forEach(dependent => {
        if(counter==dependents.length-1){
            ws = createWorkSheet(wb,dependents[dependents.length-1],month,year);
            wb.write(path.join(__dirname,'..','/config/excel/data.xlsx'),function(err,data){
                if(err){
                    callback(err);
                }else{
                    callback(null,data);
                }
            });
        }else{
            ws = createWorkSheet(wb,dependent,month,year);
            counter++;
        }
    });

}
function createWorkSheet(wb,dependent,month,year){
    var nameOfWorkSheet = dependent.name.firstName+" "+dependent.name.lastName;
    var headerText = "Medication Treatment "+getNameOfCurrentMonth(month)+" "+year;
    var ws = wb.addWorksheet(nameOfWorkSheet);
    ws.column(1).setWidth(20);
    ws.column(2).setWidth(20);
    ws.column(3).setWidth(20);
    ws.column(4).setWidth(20);
    ws.column(5).setWidth(20);
    ws = createHeader(ws,wb,1,1,headerText);
    ws = createSubHeader(ws,wb,2,1,"Dependent Information:");
    var obj = createDependentInfo(ws,wb,3,1,dependent);
    ws = obj.ws;

    var x_index = obj.x_index+1;
    var y_index = obj.y_index;
    var medCounter = 1;
    for(var i=0;i<dependent.rxsMedications.length;++i){
            ws = createSubHeader(ws,wb,x_index,y_index,"Medication #"+medCounter);
            x_index = x_index + 1
            obj = createRxsMedicationInfo(ws,wb,x_index,y_index,dependent.rxsMedications[i]);
            x_index = obj.x_index + 1;
            y_index = obj.y_index;
            medCounter++;
            ws = createSubHeader(ws,wb,x_index,y_index,"Dates Taken:");
            y_index = y_index + 1;
            ws.cell(x_index,y_index).string("Time:");
            y_index = y_index + 1;
            ws.cell(x_index,y_index).string("Given By:");
            y_index = y_index + 1;
            ws.cell(x_index,y_index).string("Was Administered:");
            y_index = y_index + 1;
            ws.cell(x_index,y_index).string("Reason:");
            y_index = 1;
            x_index = x_index + 1;
            for(var j=0;j<dependent.rxsMedications[i].events.length;++j){
                obj = createRxsMedDates(ws,wb,x_index,y_index,dependent.rxsMedications[i].events[j],month,year);
                x_index = obj.x_index;
                y_index = obj.y_index;
            }
            x_index = x_index + 1;
    }
    return ws;
}

function createRxsMedDates(ws,wb,x_index,y_index,event,month,year){
    var obj = {
        x_index:x_index,
        y_index:y_index,
        ws:ws
    }
    console.log(new Date(event.dateTaken))
    if(getCurrentTime(event.dateTaken).year()==year && getCurrentTime(event.dateTaken).month()==month){
        var date = event.dateTaken;
        var guardianName = "";
        var wasGiven = event.wasAdministered.toString();
        var reason = event.reason;
        var counter = 0;
        if(typeof(event.createdByStr)!='undefined'){
            guardianName = event.createdByStr;
        }
        if(reason.toString().toLowerCase() == 'other'){
            reason = event.notes;
        }

        ws.cell(x_index,y_index).string(getDate(date) || "-");
        y_index = y_index + 1;
        counter++;
        ws.cell(x_index,y_index).string(getTime(date) || "-");
        y_index = y_index + 1;
        counter++;
        ws.cell(x_index,y_index).string(guardianName);
        y_index = y_index + 1;
        counter++;
        ws.cell(x_index,y_index).string(wasGiven);
        y_index = y_index + 1;
        counter++;
        ws.cell(x_index,y_index).string(reason);
        y_index = y_index + 1;
        counter++;

        //Number of cols is five!!!! if you change the number of cols you have to reset it
        obj.y_index = y_index - counter;
        obj.x_index = x_index + 1;
    }
    return obj;
}
function getTime(date){
    return formatAMPM(date);
}
function getDate(date){
   return formatMMDDYYYY(date);
}
function createRxsMedicationInfo(ws,wb,x_index,y_index,rxsMedication){
    let rxsNumber = "-"
    if(rxsMedication.rxsNumber){
        rxsNumber = rxsMedication.rxsNumber.toString();
    }
    ws.cell(x_index,y_index).string("Rxs Number:");
    y_index = y_index + 1;
    ws.cell(x_index,y_index).string(rxsNumber);

    x_index = x_index + 1;
    y_index = y_index - 1;
    ws.cell(x_index,y_index).string("Name:");
    y_index = y_index + 1;
    ws.cell(x_index,y_index).string(rxsMedication.name);

    x_index = x_index + 1;
    y_index = y_index - 1;
    ws.cell(x_index,y_index).string("Doctor's Name:");
    y_index = y_index + 1;
    ws.cell(x_index,y_index).string(rxsMedication.doctorContacts.name.firstName+" "+rxsMedication.doctorContacts.name.lastName);

    x_index = x_index + 1;
    y_index = y_index - 1;
    ws.cell(x_index,y_index).string("Doctor's Contact:");
    y_index = y_index + 1;
    ws.cell(x_index,y_index).string(rxsMedication.doctorContacts.phoneNumber);

    x_index = x_index + 1;
    y_index = y_index - 1;
    ws.cell(x_index,y_index).string("Dosage:");
    y_index = y_index + 1;
    ws.cell(x_index,y_index).string(rxsMedication.dosage.quantity.toString() + " " + rxsMedication.dosage.unit);

    x_index = x_index + 1;
    y_index = y_index - 1;
    ws.cell(x_index,y_index).string("Reason:");
    y_index = y_index + 1;
    ws.cell(x_index,y_index).string(rxsMedication.reason);

    x_index = x_index + 1;
    y_index = y_index - 1;
    ws.cell(x_index,y_index).string("Date Prescribed:");
    y_index = y_index + 1;
    ws.cell(x_index,y_index).string(getDate(rxsMedication.datePrescribed));

    x_index = x_index + 1;
    y_index = y_index - 1;
    ws.cell(x_index,y_index).string("Instructions:");
    y_index = y_index + 1;
    ws.cell(x_index,y_index).string(rxsMedication.instructions || "-");

    x_index = x_index + 1;
    y_index = y_index - 1;
    ws.cell(x_index,y_index).string("End Date:");
    y_index = y_index + 1;
    ws.cell(x_index,y_index).string(getDate(rxsMedication.endDate) || "-");

    var obj = {
        x_index:x_index+1,
        y_index:y_index-1,
        ws:ws
    }

    return obj;
}
function createSubHeader(ws,wb,x_index,y_index,text){
    var style = wb.createStyle({
        font: {
          size: 16,
        }
      });
    ws.cell(x_index,y_index).string(text).style(style);
    return ws;
}
function createHeader(ws,wb,x_index,y_index,text){
    var style = wb.createStyle({
        font: {
          size: 20,
        }
      });
    ws.cell(x_index,y_index).string(text).style(style);
    return ws;
}
function createDependentInfo(ws,wb,x_index,y_index,dependent){
    var dob = dependent.dateOfBirth;
    var dop = dependent.dateOfPlacement || "-";
    var year = dob.substr(0,4);
    var day = dob.substr(5,2);
    var month = dob.substr(8,2);
    dob = day+"-"+month+"-"+year;

    ws.cell(x_index,y_index).string("First Name:");
    y_index = y_index + 1;
    ws.cell(x_index,y_index).string(dependent.name.firstName);

    x_index = x_index + 1;
    y_index = y_index - 1;
    ws.cell(x_index,y_index).string("Last Name:");
    y_index = y_index + 1;
    ws.cell(x_index,y_index).string(dependent.name.lastName);

    x_index = x_index + 1;
    y_index = y_index - 1;
    ws.cell(x_index,y_index).string("Date of Birth:");
    y_index = y_index + 1;
    ws.cell(x_index,y_index).string(dob);

    x_index = x_index + 1;
    y_index = y_index - 1;
    ws.cell(x_index,y_index).string("Date of Placement:");
    y_index = y_index + 1;
    ws.cell(x_index,y_index).string(dop);

    var obj = {
        x_index:x_index+1,
        y_index:y_index-1,
        ws:ws
    }

    return obj;
}
function getNameOfCurrentMonth(index){
    let monthNames = ["January", "February", "March", "April", "May", "June",
                        "July", "August", "September", "October", "November", "December"
                        ];


    return monthNames[index];
}
module.exports = {exportDataGivenMonthYear}
