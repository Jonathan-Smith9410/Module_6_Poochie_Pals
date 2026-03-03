// The commented out is what was there befor if you want to refere to it
// const { S3StreamLogger } = require('s3-streamlogger');

// const s3stream = new S3StreamLogger({
//     bucket: "makers-cloud-poochie-pals-access-logs",
//     folder: "application-logs",
//     name_format: "%Y-%m-%d-%H-%M-%S-%L-web-<hostname>.log",
//     config: { region: "eu-west-2" }
// });

// Redirect the logger to the local console
const logger = (logged) => {
    console.log("[LOCAL-LOG]: " + logged);
};

module.exports = logger;