import aws from "aws-sdk";
import fs from "fs";
import path from "path";

const uploadProductImage = (req, res) => {
  aws.config.setPromisesDependency();
  aws.config.update({
    credentials: {
      accessKeyId: process.env.AWS_S3_ACCESSKEYID,
      secretAccessKey: process.env.AWS_S3_SECRETACCESSKEY,
    },
    region: process.env.AWS_S3_REGION,
  });

  const s3 = new aws.S3();

  const imageName = `${path.basename(
    req.file.originalname,
    path.extname(req.file.originalname)
  )}-${Date.now()}${path.extname(req.file.originalname)}`;

  var params = {
    ACL: "public-read",
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Body: fs.createReadStream(req.file.path),
    Key: `products/${imageName}`,
  };

  s3.upload(params, (error, data) => {
    if (error) {
      res.status(error.statusCode).send(error.message);
    }

    if (data) {
      fs.unlinkSync(req.file.path); // Empty uploads folder
      const locationUrl = data.Location;
      res.send(locationUrl);
    }
  });
};

export { uploadProductImage };
