// Setting up express
let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let mongoose = require('mongoose');
let usersRouter = require('./routes/users');
let emailRouter = require('./routes/mailer');
let guardiansRouter = require('./routes/guardians');
let dependentsRouter = require('./routes/dependents');
let groupsRouter = require('./routes/groups');
let authRouter = require('./routes/auth');
// let calendarRouter = require('./routes/calendar');
let rxsMedicationRouter = require('./routes/rxsMedication');
let notificationRouter = require('./routes/notifications');
let medicationEvent = require('./routes/medicationEvent');
let exportDataRouter = require('./routes/exportData');
let PORT = process.env.PORT || 4000;
let MONGO_URI = process.env.MONGODB_URI || require('./config/configVars').MONGODB_URI;

if (process.env.NODE_ENV != 'production') {
    let cors = require('cors');
    app.use(cors());
}

app.use((req, res, next) => {
    let allowedOrigins = ['https://sach-medapp.herokuapp.com','https://med-app-testing.herokuapp.com'];
    let origin = req.headers.origin;
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
app.use("/api/rxsMedication/", rxsMedicationRouter);
app.use("/api/auth/email/", emailRouter);
app.use("/api/auth/", authRouter);
app.use("/api/dependents/", dependentsRouter);
app.use("/api/rxsMedication-event/", medicationEvent);
// app.use("/api/calendar/", calendarRouter);
app.use("/api/notifications/",notificationRouter);
app.use("/api/export-data/", exportDataRouter);

app.get('/api', function (req, res) {
    res.send("success");
});

app.use(function (error, req, res, next) {
    res.send(error);
});

if (process.env.NODE_ENV === 'production') {
    let root = require('path').join(__dirname, 'frontend', 'build')
    app.use(express.static(root));
    app.get("*", (req, res) => {
        res.sendFile('index.html', { root });
    });
}

app.listen(PORT, function (req, res) {
    console.log('\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n' +
        'Listening on PORT:' + PORT + '\n');
});
