import { createMessage } from './messages';
import { API_URI } from '../config/variables';
const saveAs = require('file-saver');

export const fetchExportData = (month, year) => (dispatch) => {
  var jwt = localStorage.getItem('JWT');
  fetch(API_URI + "/export-data/"+ month + "/" + year +"/" +jwt, {
    headers: {
      'Content-Type': 'text/csv'
    },
    responseType: 'blob'
  }).then(response => response.blob())
    .then(blob => saveAs(blob, getNameOfCurrentMonth(month) + " " + year + '.csv'));
}

function getNameOfCurrentMonth(index) {
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  return monthNames[index];
}
