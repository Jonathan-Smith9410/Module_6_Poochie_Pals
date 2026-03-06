WHITEBOX TESTING

1. ./app.js lines 27-29:

app.use(session({
  secret: 'SECRET',
}));

Hardcoded secret. Needs removal, use managed secrets or environment variables.


2. ./app.js lines 19-20:

// allow all CORS
app.use(cors({ origin: '*' }));

Apparently allows all websites access to the API - should be whitelisted domains only.


3. ./config/credentials

AWS Access key and Secret key stored in plaintext and uploaded to GitHub. Needs removal, use managed secrets or environment variables.


4. ./bin/seed-db.js lines 15-20

All user details stored in plaintext. Databse requires encryption.


5. ./lib/logger.js line 4

Gives a lot of information away in file name. Requires change of filename.


6. ./routes/account.js line 5

IDOR vulnerability, is fetching based ONLY on the ID given in the URL. http://poochie-pals-web-lb-1487923387.eu-west-2.elb.amazonaws.com/account/2940 is for Fred Smith. Manually changing the line to: http://poochie-pals-web-lb-1487923387.eu-west-2.elb.amazonaws.com/account/2939 gives a different account.


7. ./routes/index.js line 9

Potential information leakage via current_user as database object contains sensitive data. Should only pass specific info needed.


8. ./routes/sign-in.js line 15

Data including password sent as plaintext over unencrypted protocol (HTTP, not HTTPS). Requires enabling of HTTPS.

Vulnerable to SQL Injection as it's using string interpolation in the query. For example, can login as admin using the following string:

admin@example.com' OR '1'='1' --

This will always evaluate to true and will log you in as the first entry in the SQL table, usually admin. Database entries should be sanitised using parameterisation.

All user details stored in plaintext. Requires encryption, see point 4 above.


9. ./routes/sign-up.js lines 13 - 18

Data including password sent as plaintext over unencrypted protocol (HTTP, not HTTPS), see point 8.

Vulnerable to SQL Injection as it's using string interpolation in the query, see point 8.

Line 27 - too much information stored in logger - don't need full name, just username. Only relevant data should be added to logs.

Vulnerable to Log Forging - misleading information can be added to logs; if username has \n characters in it it can be used to forge log entries. Requires sanitising by adding to the catch block.


10. ./routes/sign-up lines 58-61

Password field not protected, should have row of asterisks. Field input should be set to type=password.


11. S3 Bucket is public

Fix by setting to private.


12. AWS Security group is open

Fix by restricing access and traffic in security group table using rules of least privelege.


BEARER SCAN:

CRITICAL: Usage of hard-coded secret [CWE-798]
https://docs.bearer.com/reference/rules/javascript_express_hardcoded_secret
To ignore this finding, run: bearer ignore add 0ec5e66841ef7956aa183e4b3116ad93_0

File: app.js:27

 27 app.use(session({
 28   secret: 'SECRET',
 29 }));

As above. Major security risk if codebase becomes exposed. Should use environment variables or secret management.


CRITICAL: Missing secure HTTP server configuration [CWE-319]
https://docs.bearer.com/reference/rules/javascript_express_https_protocol_missing
To ignore this finding, run: bearer ignore add 747ee7aa13d386a627c3245715b1dba4_0

File: bin/www:22

 22 var server = http.createServer(app);

Not using HTTPS, therefore data is unencrypted in transit and can be intercepted. Require HTTPS enabling.


CRITICAL: Usage of hard-coded secret [CWE-798]
https://docs.bearer.com/reference/rules/javascript_lang_hardcoded_secret
To ignore this finding, run: bearer ignore add b81c4d905845a863c2dbafe210ba6610_0

File: app.js:28

 28   secret: 'SECRET',

As above. Major security risk if codebase becomes exposed. Should use env variables or secret management.


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

Vulnerable to SQL injection attack as request data is sanitised. Needs to use parameterised data.


MEDIUM: Usage of default session cookie configuration [CWE-693]
https://docs.bearer.com/reference/rules/javascript_express_default_session_config
To ignore this finding, run: bearer ignore add 03ff68c49b60ef34aa387a5058c1dc7d_0

File: app.js:27

 27 app.use(session({
 28   secret: 'SECRET',
 29 }));

Session cookie is set with its default values, making it predictable. Can then be exploited. Session cookies should be given generic non-descriptive names.


MEDIUM: Missing Helmet configuration on HTTP headers [CWE-693]
https://docs.bearer.com/reference/rules/javascript_express_helmet_missing
To ignore this finding, run: bearer ignore add ceb9f97741f7686615f69620a8ec2025_0

File: app.js:17

 17 var app = express();

Warning suggests using Helmet middleware to automatically set HTTP headers and avoid vulnerabilities such as clickjacking.


MEDIUM: Missing server configuration to reduce server fingerprinting [CWE-693]
https://docs.bearer.com/reference/rules/javascript_express_reduce_fingerprint
To ignore this finding, run: bearer ignore add 56b4b80441669f82df897f20ddcfb1a9_0

File: app.js:17

 17 var app = express();

This is revealing the server's technology stack. Express module should be configured to reveal as little about the configuration and inner workings of a deployment as possible, as such information can give a malicious actor the information needed to construct a targeted attack.


MEDIUM: Usage of session on static asset (CSRF) [CWE-352]
https://docs.bearer.com/reference/rules/javascript_express_static_asset_with_session
To ignore this finding, run: bearer ignore add 4a691786f826fb4546e42fa804c49322_0

File: app.js:34

 34 app.use(express.static(path.join(__dirname, 'public')));

As this has been executed after the app.use(session(...)) line, a session cookie is attached to the response for a static image. This can be cached by a CDN, which can then inadvertently serve it to another user, effectively logging the second user in as the frst. In the example given, a session cookie is attached to two of the static images in the site, the values of which can then be used by an attacker to pick up someone else's session, Efffectively logging in as them. Fix by executing this before the app.use(session(...)) line.


LOW: Leakage of information in logger message [CWE-532]
https://docs.bearer.com/reference/rules/javascript_lang_logger_leak
To ignore this finding, run: bearer ignore add 7d8405c1f26710b385d20939862c2f13_0

File: bin/seed-db.js:7

 7     console.error(err.message);

Database information is being logged - sensitivie info shouldn't be inlcuded in logger messages. See whitebox testing point 9 above.


ZAP SCAN

Alert Counts by Alert Type
This table shows the number of alerts of each alert type, together with the alert type's risk level.

(The percentages in brackets represent each count as a percentage, rounded to one decimal place, of the total number of alerts included in this report.)

Alert type	                                                                      Risk            Count
Absence of Anti-CSRF Tokens	                                                      Medium	      2
(11.8%)

These are unpredictable tokens to check that a request was intentionally submitted by the user and isn't a result of cross-site request forgery.
The app needs a library like csurf in the Express application to generate and validate the tokens for all relevant requests.


CSP: Failure to Define Directive with No Fallback	                              Medium	      3
(17.6%)

The content security policy doesn't have instructions for frame-ancestors and form-action, so they're vulnerable to hijacking or malicious frame embedding. They need to be added to the CSP configuration.


Content Security Policy (CSP) Header Not Set	                                  Medium	      4
(23.5%)

LAck of CSP header removes defence against XSS and injection attacks. It mean the browser has no instructions on which scripts, styles and images are trusted, which makes it vulnerable. Can be fixed by using the Helmet middleware.


Cross-Domain Misconfiguration	                                                  Medium	      5
(29.4%)

As above. Apparently allows all websites access to the API - should be whitelisted domains only.


HTTP Only Site	                                                                  Medium	      1
(5.9%)

As above. Not using HTTPS, therefore data is unencrypted in transit and can be intercepted. All HTTP traffic should be redirected to HTTPS in load balancer or proxy.


Missing Anti-clickjacking Header	                                              Medium	      4
(23.5%)

Allows site to be loaded in a frame on another site. An attacker can put a layer of your site over theirs and trick users into clicking buttons with malicious content. Needs X-Frame-Options header set to DENY or SAMEORIGIN.


Cookie without SameSite Attribute	                                              Low	          3
(17.6%)

Because cookies are missing the SameSite attribute, the browser defaults to sending them with cross-site requests, which makes it vulnerable to CSRF attacks. Needs the SameSite=Lax or SameSite=Strict attribute adding to all sensitive cookies.


Server Leaks Information via "X-Powered-By" HTTP Response Header Field(s)	      Low	          5
(29.4%)

As above. This is revealing the server's technology stack. Express module should be configured to reveal as little about the configuration and inner workings of a deployment as possible, as such information can give a malicious actor the information needed to construct a targeted attack. Can be fixed by using the Helmet middleware which will remove the X-Powered-By: Express header.


Server Leaks Version Information via "Server" HTTP Response Header Field	      Low	          5
(29.4%)

The header is revealing exact version numbers. This is revealing the server's technology stack. If the specific software versions have known vulnerabilities to exploit, an attacker can then use them. This should be configured to hide version details, e.g. setting server_tokens to "off" in Nginx.


Strict-Transport-Security Header Not Set	                                      Low	          4
(23.5%)

Even if HTTPS is enabled, the first connection might be via HTTP. If the HTTP Strict Transport Security (HSTS) header is missing, an attacker can remove the SSL/TLS and keep the user on an unencrypted connection permanently. Needs the Strict-Transport-Security header adding.


Timestamp Disclosure - Unix	                                                      Low	          4
(23.5%)

Internal Unix timestamps are visible in server responses. This could give an attacker insight into the server's configuration. Need to remove timestamps from server responses.


X-Content-Type-Options Header Missing	                                          Low	          9
(52.9%)

The nosniff header is not present in the server's HTTP responses, so browsers may try to guess file types by looking at the contents (aka MIME sniffing), which could mean that a text file containing malicious script could be executed as if it were JavaScript code. Needs the X-Content-Type-Options: nosniff header adding. 


Authentication Request Identified	                                              Informational	  1
(5.9%)

Endpoint should be protected by brute-force rate limiting.


Modern Web Application	                                                          Informational	  4
(23.5%)

Just saying that site uses JavaScript and dynamic loading. No actions necessary.

Re-examine Cache-control Directives	                                              Informational	  4
(23.5%)

Possible that private data is in public cache. Need to set Cache-Control: no-store for pages with sensitive information.

Retrieved from Cache	                                                          Informational	  4
(23.5%)

Says that cached data was found. No actions necessary. 


Session Management Response Identified	                                          Informational	  4
(23.5%)

Means that the connect.sid cookie used for user sessions was found. Need to ensure this cookie is always marked as HttpOnly and Secure (mentioned already above).