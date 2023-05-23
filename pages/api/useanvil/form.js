
import clientPromise from '../../../utils/mongo';

async function addCider(action, token, data){
  try {
    const client = await clientPromise;
    const db = client.db("ratings");

    const resp = await db
      .collection("cider")
      .insertOne({
        name: token,
        rating: data,
        hasImage: false
      })

      return JSON.parse(JSON.stringify(resp));

    // console.log( {
    //     props: { movies: JSON.parse(JSON.stringify(movies)) },
    // })
  } catch (e) {
      console.error(e);
  }
}

export default async function restaurants(req,res){
  if (req.method !== 'POST') {
    return res.status(400).json({message: 'Bad request'});
  } else {
    const { action, token, data } = req.body;
    const resp = await addCider(action, token, data);
    return res.status(200).json(resp);
  }
}
