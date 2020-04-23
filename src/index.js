const express = require('express');
const queries = require('./queries');
const PORT = process.env.PORT || 3030;
const app = express();

/* JSON body parse*/
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/* CORS cross domain 
*  Replace * with your domain
*/
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); 
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

/* Request validation */
const { validate, ValidationError, Joi } = require('express-validation');


app.get('/users', async (req, res, next) => {
  try {
    queries.users().then((data) => {
      res.json(data);
    });
  } catch (err) {
    res.json(err);
  }
});

/* ui validation*/
const uidValidation = {
    params: Joi.object({
        uid: Joi.number().integer().required(),
    }),
  };

app.get('/user/:uid', validate(uidValidation), async (req, res, next) => {
  const uid = req.params.uid;
  try {
    queries.user(uid).then((data) => {
      res.json(data);
    });
  } catch (err) {
    res.json(err);
  }
});

/* Signup validation*/
const signupValidation = {
  body: Joi.object({
    email: Joi.string().email().required(),
    username: Joi.string().min(3).max(20).required(),
    password: Joi.string().regex(/^[a-zA-Z0-9]{8,30}$/).required(),
  }),
};

app.post('/signup', validate(signupValidation), async (req, res, next) => {
  const postData = req.body;
  try {
    queries.signup(postData).then((data) => {
      res.json({ status: 'success' });
    });
  } catch (err) {
    res.json(err);
  }
});


/* Send message validation*/
const sendMessageValidation = {
  body: Joi.object({
    uid: Joi.number().integer().required(),
    message: Joi.number().integer().required()
  }),
};

app.post('/sendMessage', validate(sendMessageValidation), async (req, res, next) => {
  const postData = req.body;
  try {
    queries.sendMessage(postData).then((data) => {
      res.json({ status: 'success' });
    });
  } catch (err) {
    res.json(err);
  }
});

/*  messages validation*/
const messagesValidation = {
  body: Joi.object({
    uid: Joi.number().integer().required()
  }),
};

app.post('/messages', validate(messagesValidation), async (req, res, next) => {
  const postData = req.body;
  try {
    queries.messages(postData).then((data) => {
      res.json({ status: 'success' });
    });
  } catch (err) {
    res.json(err);
  }
});

/*  message delete validation*/
const messageValidation = {
  params: Joi.object({
    uid: Joi.number().integer().required(),
    mid: Joi.number().integer().required()
  }),
};

app.delete('/message/:uid/:mid', validate(messageValidation), async (req, res, next) => {
  const uid = req.params.uid;
  const mid = req.params.mid;
  try {
    queries.messageDelete(uid, mid).then((data) => {
      res.json({ status: 'success' });
    });
  } catch (err) {
    res.json(err);
  }
});

app.use(function (err, req, res, next) {
    if (err instanceof ValidationError) {
      return res.status(err.statusCode).json(err);
    }
    return res.status(500).json(err);
  });

app.listen(PORT, () => {
  console.log('Server is running on PORT:', PORT);
});
