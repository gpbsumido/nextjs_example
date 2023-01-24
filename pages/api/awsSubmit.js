import S3 from 'aws-sdk/clients/s3'

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "20mb"
    },
  }
};

async function postHandler(req,res) {

  try {
    const s3 = new S3({
      region: 'ca-central-1',
      accessKeyId: process.env.ACCESS_KEY,
      secretAccessKey: process.env.SECRET_KEY,
      signatureVersion: "v4"
    })

    let { name, type } = req.body;
    const fileParams = {
      Bucket: process.env.BUCKET_NAME,
      Key: name,
      Expires: 600,
      ContentType: type,
      // ACL: "public-read"
    };
  
    return s3.getSignedUrlPromise("putObject",fileParams);

  } catch(e) {
    console.error(e)
    return res.status(400).json({message: "Uploading failed!"});
  }
  // client.close();
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(400).json({message: 'Bad request'});
  } else {
    const url = await postHandler(req,res);
    return res.status(200).json({ url });
  }
  // return res.status(200).json({ message: 'Uploading aws success!' })
}