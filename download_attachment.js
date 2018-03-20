var date = require('date-and-time');//for date and time
var fs = require('fs');//File reading
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');
var program = require('commander');

///////////////
//Date starts//
///////////////

const now = new Date();

//present date in DD-MM-YYYY Format, to make a folder of today's files 
var ddmmyy = date.format(now, 'DD-MM-YYYY');

var dd_mm_yy = date.addDays(now, -1);  // => Date object

//and yesterday date in YYYY/MM/DD, to pass in search query
var yesterday = date.format(dd_mm_yy, 'YYYY/MM/DD');//object to date

console.log("Yesterday - %s", yesterday);// just to make sure

/////////////
//Date ends//
/////////////

/////////////////////////////////////////////
//Google NodeJs Quickstart code starts here//
/////////////////////////////////////////////

// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/gmail-nodejs-quickstart.json
var SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
    process.env.USERPROFILE) + '/.credentials/';
var TOKEN_PATH = TOKEN_DIR + 'gmail-nodejs-quickstart.json';

// Load client secrets from a local file.
fs.readFile('client_secret.json', function processClientSecrets(err, content) {
  if (err) {
    console.log('Error loading client secret file: ' + err);
    return;
  }
  // Authorize a client with the loaded credentials, then call the
  // Gmail API.
  authorize(JSON.parse(content), foo);
});

function authorize(credentials, callback) {
  var clientSecret = credentials.installed.client_secret;
  var clientId = credentials.installed.client_id;
  var redirectUrl = credentials.installed.redirect_uris[0];
  var auth = new googleAuth();
  var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, function(err, token) {
    if (err) {
      getNewToken(oauth2Client, callback);
    } else {
      oauth2Client.credentials = JSON.parse(token);
      callback(oauth2Client);
    }
  });
}

function getNewToken(oauth2Client, callback) {
  var authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });
  console.log('Authorize this app by visiting this url: ', authUrl);
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question('Enter the code from that page here: ', function(code) {
    rl.close();
    oauth2Client.getToken(code, function(err, token) {
      if (err) {
        console.log('Error while trying to retrieve access token', err);
        return;
      }
      oauth2Client.credentials = token;
      storeToken(token);
      callback(oauth2Client);
    });
  });
}

function storeToken(token) {
  try {
    fs.mkdirSync(TOKEN_DIR);
  } catch (err) {
    if (err.code != 'EEXIST') {
      throw err;
    }
  }
  fs.writeFile(TOKEN_PATH, JSON.stringify(token));
  console.log('Token stored to ' + TOKEN_PATH);
}

/////////////////////////////////////////////
//Google NodeJs Quickstart code starts here//
/////////////////////////////////////////////

/////////////////////////////
//NPM Commander code starts//
/////////////////////////////

program
  .version('0.1.0')
  .option('-f, --from <email>', 'Email Id of sender')
  .option('-a, --after [value]', 'after date YYYY/MM/DD [Default value is the date of yesterday in YYYY/MM/DD format]')
  .option('-n, --num_email [value]', 'num_email number of recent emails will be searched for attachment. [Default value 1]')
  .parse(process.argv);

///////////////////////////
//NPM Commander code ends//
///////////////////////////

/////////////////////////////
//function foo starts here //
/////////////////////////////


function foo(auth) {
  //commander args
  var from;
  var after;
  var num_email;

  if(program.from != undefined)
    from = program.from;
  else
    console.log("Error: Please input required field '--from' ");

  if(program.after != undefined)
    after = program.after;
  else
    after = yesterday;

  if(program.num_email != undefined)
    num_email = program.num_email;
  else
    num_email = 1;
  //cammander args

  var messages;

  console.log("Fetching list of Messages");
  var gmail = google.gmail('v1');
  gmail.users.messages.list({
    auth: auth,
    userId: 'me',
  },{qs: {
      maxResults: num_email, 
      q: 'has:attachment from:'+from+' after:'+after.toString(),
    } },
    (err, response) => {
      if(err) console.log("Error - %s", err);
      if(response.messages.length) console.log("Response - %s", response.messages.length);

      for(var m=0; m<response.messages.length; m++){
        var msg_length = response.messages.length;
        try{throw msg_length}
        catch(msg_length){
            var msg = response.messages[0].id;
            var gmail = google.gmail('v1');

            console.log("Fetching that one message");
            gmail.users.messages.get({
              auth: auth,
              id: msg,
              userId: 'me',
              prettyPrint: 'true',
            }, (err, response) => {
              var res = response;
              // for(part in res.payload.parts){
                for(var j=0; j<res.payload.parts.length; j++){
                  part = res.payload.parts[j];
                  
                try{throw part.filename}
                catch(file){
                  if(file){
                    if("data" in part.body){
                      var data = part.body.data
                    } else {
                      console.log("Downloading %s", file);
                      var att_id = part.body.attachmentId;
                      var gmail = google.gmail('v1');
                      gmail.users.messages.attachments.get({
                        auth: auth,
                        id: att_id,
                        messageId: response.id,
                        userId: 'me',
                      }, (err, response) => {
                        if(err) console.log(err);
                        if (!fs.existsSync(ddmmyy)){
                            fs.mkdirSync(ddmmyy);
                        }

                        var buf = new Buffer(response.data, 'base64');
                        fs.appendFile(ddmmyy+"/"+file, buf, (err) => {
                          if(err) console.log("Error - %s", err);
                        });
                        // console.log(JSON.stringify(response));
                      });
                    }
                     
                  } else{
                    console.log("No file to download");
                  }
                }
              }
            });
        }
      }
  });
}

///////////////////////////
//function foo ends here //
///////////////////////////