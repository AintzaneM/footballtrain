require('dotenv').config();
require('./db')
const morgan = require('morgan');
const express = require('express');
const session = require("express-session");
const MongoStore = require("connect-mongo");

const bodyParser = require('body-parser');



const app = express();
// ℹ️ Middleware that adds a "req.session" information and later to check that you are who you say you are 😅
app.use(
    session({
      secret: process.env.SESSION_SECRET || "super hyper secret key",
      resave: false,
      saveUninitialized: true,
      cookie: { sameSite: process.env.NODE_ENV === "production" ? 'none' : 'lax', // must be 'none' to enable cross-site delivery 
      secure: process.env.NODE_ENV === "production", // must be true if sameSite='none' 
    } 
    })
  );

  app.use((req, res, next) => {
    req.user = req.session.user || null;
    next();
  });
app.use(express.json());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

const authRouter = require ('./routes/authRoutes');
app.use('/api', authRouter);
const planRouter = require('./routes/planRoutes');
app.use('/api', planRouter);
const clubRouter = require('./routes/clubRoutes');
app.use('/api', clubRouter);
const attendanceRouter = require('./routes/attendanceRoutes');
app.use('/api', attendanceRouter);
const teamRouter = require('./routes/teamRoutes');
app.use('/api', teamRouter);
const userRouter = require('./routes/userRoutes');
app.use('/api', userRouter);







app.listen(process.env.PORT, () => {
    console.log('port is listening on ' + process.env.PORT);
}); 