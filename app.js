const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const errorHandler = require('./middleware/error');
// Route files
const users = require('./router/users');

const connectDb = require('./db');
connectDb();
app.use(express.json());
app.use(cors());

app.use(morgan('dev'));
app.use('/api/v1/users', users);
app.use(errorHandler);

app.listen('3000', console.log(`server running in 3000`));
// error mw
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error ${err.message}`);
});
