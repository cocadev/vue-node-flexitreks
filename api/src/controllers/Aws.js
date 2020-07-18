import aws from 'aws-sdk';
if (process.env.S3_ACCESS) {
  aws.config.update({
    secretAccessKey: process.env.S3_ACCESS,
    accessKeyId: process.env.S3_Key,
    region: process.env.S3_Region
  });
}

export default aws;
