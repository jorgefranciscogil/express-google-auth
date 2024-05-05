const express = require("express");
const jose = require('jose');
const bodyParser = require('body-parser');

const { OAuth2Client } = require('google-auth-library');
const keys = require('./oauth2.keys.json');

const app = express();

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = process.env.PORT || 3001;

app.post("/", async (req, res, next) => {
  console.log('BODY', req.body);
  console.log('PARAMS', req.body);
  console.log('CREDENTIALS', jose.decodeJwt(req.body.credential));
  console.log('HEADERS', JSON.stringify(req.headers));

  try {
    const oAuth2Client = new OAuth2Client(keys.web.client_id);
    const ticket = await oAuth2Client.verifyIdToken({
      idToken: req.body.credential,
      audience: keys.web.client_id
    });
    // const payload = ticket.getPayload();
    console.log('ticket!!', ticket);
    // return res.status(200).json('OK!');
    return res.redirect(keys.web.javascript_origins[1]);
  } catch (err) {
    next(err);
  }

});

app.listen(port, () => console.log(`Listening on port ${port}!`));