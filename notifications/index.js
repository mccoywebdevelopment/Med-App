let UserReminders = require('./UserReminder').init;
let AdminMedNotifications = require('./AdminMedEvents').init;

/*
    User reminders occur 20 minutes before the ending period
*/
UserReminders();

/*
    Admin notifications occure after each period admin will receive
    notification on who forgot to take thier medication 
*/
AdminMedNotifications();