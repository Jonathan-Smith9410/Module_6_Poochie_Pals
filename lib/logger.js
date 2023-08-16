const { S3StreamLogger } = require('s3-streamlogger');

const s3stream = new S3StreamLogger({
    bucket: "makers-cloud-poochie-pals-access-logs",
    folder: "application-logs",
    name_format: "%Y-%m-%d-%H-%M-%S-%L-web-<hostname>.log",
    config: { region: "eu-west-2" }
});

const logger = (logged) => {
    s3stream.write(logged + "\n");
};

module.exports = logger;