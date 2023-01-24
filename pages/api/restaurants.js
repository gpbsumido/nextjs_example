
import clientPromise from '../../utils/mongo';

async function getRestaurants(){
  try {
    const client = await clientPromise;
    const db = client.db("sample_restaurants");
  
    const movies = await db
      .collection("restaurants")
      .find({})
      .sort({ metacritic: -1 })
      .limit(20)
      .toArray();
  
      // console.log( {
      //     props: { movies: JSON.parse(JSON.stringify(movies)) },
      // }) 
    return movies;
  } catch (e) {
      console.error(e);
  }
}

export default async function restaurants(req,res){
  const resp = await getRestaurants();
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'max-age=180000');
  res.end(resp);
}
