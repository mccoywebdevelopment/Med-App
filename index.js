// Setting up express
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const configVars = require('./config/configVars');
const mongoose = require('mongoose');
const usersRouter = require('./routes/api/users');
const emailRouter = require('./routes/api/mailer');
const guardiansRouter = require('./routes/api/guardians');
const dependentsRouter = require('./routes/api/dependents');
const groupsRouter = require('./routes/api/groups');
const authRouter = require('./routes/api/auth');
const medsRouter = require('./routes/api/medications');
const calendarRouter = require('./routes/api/calendar');
const prescriptionsRouter = require('./routes/api/prescriptions');
const rxsMedicationRouter = require('./routes/api/rxsMedication');
const eventRouter = require('./routes/api/event');
const dataRouter = require('./routes/api/data');
const medicationEvent = require('./routes/api/medicationEvent');
const exportDataRouter = require('./routes/api/exportData');
const PORT = process.env.PORT || 4000;

if(process.env.NODE_ENV !='production'){
    const cors = require('cors');
    app.use(cors());
}

var mongoURL = configVars.MONGODB_KEY;
if(process.env.MONGODB_URI){
    mongoURL = process.env.MONGODB_URI;

}

mongoose.connect(mongoURL,{ useNewUrlParser: true,useUnifiedTopology: true},function(err) {
    if (err) throw err;
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use("/api/users/", usersRouter);
app.use("/api/guardians/", guardiansRouter);
app.use("/api/groups/", groupsRouter);
app.use("/api/medications/", medsRouter);
app.use("/api/rxs/", prescriptionsRouter);
app.use("/api/rxsMedication/", rxsMedicationRouter);
app.use("/api/auth/email/",emailRouter);
app.use("/api/auth/",authRouter);
app.use("/api/dependents/", dependentsRouter);
app.use("/api/data/",dataRouter);
app.use("/api/events/",eventRouter);
app.use("/api/rxsMedication-event/",medicationEvent);
app.use("/api/calendar/",calendarRouter);
app.use("/api/export-data/",exportDataRouter);

app.get('/api',function(req,res){
    res.send("success");
});

app.use(function(error, req, res, next) {
    res.send(error);
});

if(process.env.NODE_ENV ==='production'){
    configVars.BASE_URL = "https://sun-note.herokuapp.com";
    configVars.CLIENT_URL = "https://sun-note.herokuapp.com";
    const root = require('path').join(__dirname, 'client', 'build')
    app.use(express.static(root));
    app.get("*", (req, res) => {
        res.sendFile('index.html', { root });
    });
    if(process.env.BASE_URL){
        configVars.BASE_URL = process.env.BASE_URL;
    }
    if(process.env.CLIENT_URL){
        configVars.CLIENT_URL = process.env.CLIENT_URL;
    }

}

app.listen(PORT,function(req,res){
    console.log('\nListening on PORT:'+PORT+'\n');
});