Problems found:


1. ./app.js lines 27-29:

app.use(session({
  secret: 'SECRET',
}));

Hardcoded secret


2. ./app.js lines 19-20:

// allow all CORS
app.use(cors({ origin: '*' }));

Apparently allows all websites access to the API - should be whitelisted domains only.


3. ./app.js lines 42-25:

// catch 404 and forward to error handler
// app.use(function (req, res, next) {
//   next(createError(404));
// });

Unsure if this is a vulnerability? Will mean that default error handler is used?

**Unlikely to be a problem**


4. ./config/credentials

AWS Access key and Secret key stored in plaintext and uploaded to GitHub


5. ./bin/seed-db.js lines 15-20

All user details stored in plaintext


6. ./bin/www line 8

Is debug active on the server?

**Look like this is fine, it's more secure than printing to the terminal, does nothing unless explicitly switched on in a debugging sesion**


7. ./lib/logger.js line 4

Gives a lot of information away in file name


8. ./routes/account.js line 5

If userID is primary key, can be bruteforced by guessing or adding incremental numbers to URL?
Should userID be obfuscated?

**YES - IDOR vulnerability, is fetching based ONLY on the ID given in the URL. http://poochie-pals-web-lb-1487923387.eu-west-2.elb.amazonaws.com/account/2940 is for Fred Smith. Manually changing the line to: http://poochie-pals-web-lb-1487923387.eu-west-2.elb.amazonaws.com/account/2939 gives a different account (Made by ZAP?)**



9. ./routes/index.js

**Look into req.session.user**


10. ./routes/sign-in.js line 15

Not sanitised or escaped, vulnerable to SQL injection attacks?

**YES - vulnerable to SQL Injection as it's using string interpolation in the query**

All user details stored in plaintext

In logger, is too much information stored? (Lines 25 to 37)

Where is that stored and who has permissions?


11. ./routes/sign-up.js lines 13 - 18

Data including password sent as plaintext over unencrypted protocol (HTTP, not HTTPS)

Input not sanitised, vulnerable to script injection?

**No - sequelize uses parameterized queries by default** 

Line 27 - too much information stored in logger - don't need full name, just username

Could misleading information be added to logs?

**YES - if username has \n characters in it it can bu used to forge log entries**


12. ./routes/sign-up lines 58-61

Password field not protected, should have row of asterisks.
Field input should be type=password


Bearer scan results:

CRITICAL: Usage of hard-coded secret [CWE-798]
https://docs.bearer.com/reference/rules/javascript_express_hardcoded_secret
To ignore this finding, run: bearer ignore add 0ec5e66841ef7956aa183e4b3116ad93_0

File: app.js:27

 27 app.use(session({
 28   secret: 'SECRET',
 29 }));

CRITICAL: Missing secure HTTP server configuration [CWE-319]
https://docs.bearer.com/reference/rules/javascript_express_https_protocol_missing
To ignore this finding, run: bearer ignore add 747ee7aa13d386a627c3245715b1dba4_0

File: bin/www:22

 22 var server = http.createServer(app);

CRITICAL: Usage of hard-coded secret [CWE-798]
https://docs.bearer.com/reference/rules/javascript_lang_hardcoded_secret
To ignore this finding, run: bearer ignore add b81c4d905845a863c2dbafe210ba6610_0

File: app.js:28

 28   secret: 'SECRET',

CRITICAL: Unsanitized input in SQL query [CWE-89]
https://docs.bearer.com/reference/rules/javascript_lang_sql_injection
To ignore this finding, run: bearer ignore add ffe8edb2a2c385c5c73f777557c47ad4_0

File: routes/sign-in.js:14

 14     const users = await sequelize.query(
 15       `SELECT * FROM Users WHERE email = '${req.body.email}' AND password = '${req.body.password}';`,
 16       {
 17         model: User,
 18         mapToModel: true
 19       });

MEDIUM: Usage of default session cookie configuration [CWE-693]
https://docs.bearer.com/reference/rules/javascript_express_default_session_config
To ignore this finding, run: bearer ignore add 03ff68c49b60ef34aa387a5058c1dc7d_0

File: app.js:27

 27 app.use(session({
 28   secret: 'SECRET',
 29 }));

MEDIUM: Missing Helmet configuration on HTTP headers [CWE-693]
https://docs.bearer.com/reference/rules/javascript_express_helmet_missing
To ignore this finding, run: bearer ignore add ceb9f97741f7686615f69620a8ec2025_0

File: app.js:17

 17 var app = express();

MEDIUM: Missing server configuration to reduce server fingerprinting [CWE-693]
https://docs.bearer.com/reference/rules/javascript_express_reduce_fingerprint
To ignore this finding, run: bearer ignore add 56b4b80441669f82df897f20ddcfb1a9_0

File: app.js:17

 17 var app = express();

MEDIUM: Usage of session on static asset (CSRF) [CWE-352]
https://docs.bearer.com/reference/rules/javascript_express_static_asset_with_session
To ignore this finding, run: bearer ignore add 4a691786f826fb4546e42fa804c49322_0

File: app.js:34

 34 app.use(express.static(path.join(__dirname, 'public')));

LOW: Leakage of information in logger message [CWE-532]
https://docs.bearer.com/reference/rules/javascript_lang_logger_leak
To ignore this finding, run: bearer ignore add 7d8405c1f26710b385d20939862c2f13_0

File: bin/seed-db.js:7

 7     console.error(err.message);