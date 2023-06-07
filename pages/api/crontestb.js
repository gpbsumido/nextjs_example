export default async function restaurants(req,res){
  const resp = true;
  console.log('resp',resp)
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'max-age=180000');
  res.end(resp);
}
