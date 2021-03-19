import { API_URI } from '../config/variables';
import { FETCH } from '../config/helpers';
import { createMessage } from './messages';
import { toggleLoading } from './loading';
const saveAs = require('file-saver');

export const fetchExportData = (month, year) => (dispatch) => {
  var jwt = localStorage.getItem('JWT');
  dispatch(toggleLoading(true));
  fetch(API_URI + "/export-data/"+ month + "/" + year +"/" +jwt, {
    headers: {
      'Content-Type': 'text/csv'
    },
    responseType: 'blob'
  }).then(response => response.blob())
    .then(blob => {
      dispatch(toggleLoading(false));
      saveAs(blob, getNameOfCurrentMonth(month) + " " + year + '.csv')});
}
export const fetchQRData = (done) => (dispatch) => {
  let date = new Date();
  let month = date.getMonth();
  let year = date.getFullYear();
  var jwt = localStorage.getItem('JWT');
  dispatch(toggleLoading(true));
  fetch(API_URI + '/export-data/qr/generate-svg-code/all/' +jwt, {
    headers: {
      'Content-Type': 'text/pdf'
    },
    responseType: 'blob'
  }).then(response => response.blob())
    .then(blob => {
      dispatch(toggleLoading(false));
      saveAs(blob, getNameOfCurrentMonth(month) + " " + year +" QR"+ '.pdf')});
}

function getNameOfCurrentMonth(index) {
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  return monthNames[index];
}
