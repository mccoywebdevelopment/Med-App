// Setting up express
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const usersRouter = require('./routes/api/users');
const emailRouter = require('./routes/api/mailer');
const guardiansRouter = require('./routes/api/guardians');
const dependentsRouter = require('./routes/api/dependents');
const quickRespRouter = require('./routes/api/QR');
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
const MONGO_URI = process.env.MONGODB_URI || require('./config/configVars').MONGODB_URI;

if (process.env.NODE_ENV != 'production') {
    const cors = require('cors');
    app.use(cors());
}

app.use((req, res, next) => {
    const allowedOrigins = ['https://med-app-v1.herokuapp.com','https://med-app-testing.herokuapp.com'];
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', true);
    return next();
});

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true }, function (err) {
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
app.use("/api/auth/email/", emailRouter);
app.use("/api/auth/", authRouter);
app.use("/api/dependents/", dependentsRouter);
app.use("/api/data/", dataRouter);
app.use("/api/events/", eventRouter);
app.use("/api/rxsMedication-event/", medicationEvent);
app.use("/api/calendar/", calendarRouter);
app.use("/api/export-data/", exportDataRouter);
app.use("/api/QR/",quickRespRouter);

app.get('/api', function (req, res) {
    res.send("success");
});

app.use(function (error, req, res, next) {
    res.send(error);
});

if (process.env.NODE_ENV === 'production') {
    const root = require('path').join(__dirname, 'frontend', 'build')
    app.use(express.static(root));
    app.get("*", (req, res) => {
        res.sendFile('index.html', { root });
    });
}

app.listen(PORT, function (req, res) {
    console.log('\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n' +
        'Listening on PORT:' + PORT + '\n');
});


// require('./queries/wordDoc');