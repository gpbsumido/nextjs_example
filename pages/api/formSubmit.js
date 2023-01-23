import { IncomingForm } from 'formidable'
import { promises as fs } from 'fs'
import clientPromise from '../../utils/mongo';

export const config = {
  api: {
    bodyParser: false,
  }
};

async function postHandler(req,res) {
  let client = {};
  try {

    client = await clientPromise;
    const collection =  client.db("Test").collection("Files");

    //parse form for data
    const data = await new Promise((resolve, reject) => {
        const form = new IncomingForm()
        
        form.parse(req, async (err, fields, files) => {
            if (err) return reject(err)
            resolve({ fields, files })
        })
    });
    const contents = await fs.readFile(data?.files?.myFile.filepath, {
      encoding: 'utf8',
    })
    const FILE = {
      "fileName": data?.files?.myFile.originalFilename,
      "content": contents
    }

    //insert data into collection
    collection.insertOne(FILE);

    // //close connection
    // client.close();

  } catch(e) {
    console.error(e)
    // client.close();
    return res.status(400).json({message: "Uploading failed!"});

  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(400).json({message: 'Bad request'});
  } else {
    postHandler(req,res);
  }
  return res.status(200).json({ message: 'Uploading success!' })
}