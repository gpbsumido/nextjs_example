
import clientPromise from '../../../utils/mongo';

async function addCider(ciderName, ciderRating, hasImage){
  try {
    const client = await clientPromise;
    const db = client.db("ratings");

    const resp = await db
      .collection("cider")
      .insertOne({
        name: ciderName,
        rating: ciderRating,
        hasImage: hasImage
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
    const { name, rating, hasImage } = req.body;
    const resp = await addCider(name, rating, hasImage);
    return res.status(200).json(resp);
  }
}
