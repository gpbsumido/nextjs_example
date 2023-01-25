import Head from 'next/head'
import Link from 'next/link'
import styles from '../../styles/Home.module.css';
import landingPageStyles from '../../styles/LandingPage.module.css'
import clientPromise from '../../utils/mongo.js'
import { useState, useEffect } from 'react'
import axios from 'axios';
import S3 from 'aws-sdk/clients/s3'

export default function Ciders({ciders}){

  const s3 = new S3({
    region: 'ca-central-1',
    accessKeyId: process.env.NEXT_PUBLIC_ACCESS_KEY,
    secretAccessKey: process.env.NEXT_PUBLIC_SECRET_KEY,
    signatureVersion: "v4"
  })

  const [image,setImage] = useState();
  const [newCider,setNewCider] = useState();
  const [newRating,setNewRating] = useState();

  const [cidersWithImages,setCidersWithImages] = useState(ciders);
  
  useEffect(() => {
    async function getImages(items){
      const keys = items.map(async item => {
        const param = {
          Bucket: process.env.NEXT_PUBLIC_BUCKET_NAME,
          Key: item._id,
          Expires: 600,
        };
        return await s3.getSignedUrlPromise("getObject",param);
      });
      return await Promise.all(keys);
    }
    const resp = getImages(ciders).then(response =>{
      setCidersWithImages( prevState => {
        if (!prevState) return;
        const cidersWithImage = prevState.map( (cider,index) =>{
          let newCider = cider;
          newCider.image = response[index];
          return newCider;
        })
        return cidersWithImage;
      })
    }).catch( e => {
      console.error(e)
    })
  }, [ciders]);
  


  return (
    <div className={styles.container}>
      <Head>
        <title>Landing Page</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className={landingPageStyles.title}>
          Welcome to Paul's photography page!
        </h1>
        <div
          className={landingPageStyles.landingPageBody}
        >
          <div
            className={landingPageStyles.leftPanel}
          >
            <p>
              Links
            </p>
            <ul>
              <li>
                <Link href="/">Return to Landing Page</Link>
              </li>
              <li>
                <Link href="/submissionAws">Add new Image</Link>
              </li>
              <li>
                <Link href="/wallet">Wallet Sign in</Link>
              </li>
            </ul>
          </div>
          <div
            className={landingPageStyles.centerPanel}
          >
            <div>
              <p>Add New Cider Rating</p>
              <br />
              <p>Name</p>
              <input type='text' onChange={(e)=>setNewCider(e.target.value)}/>
              <p>Rating</p>
              <input type='number' onChange={(e)=>setNewRating(e.target.value)}/>
              <br />
              <p>Image</p>
              <input
                type="file"
                onChange={(e)=> {
                  if (e.target.files && e.target.files[0]) {
                    if (e.target.files[0].size > 10000000) {
                      console.error('Project Image must be no greater than 10mb.');
                      return;
                    }
                    setImage(e.target.files[0]);
                  }
                }}
                accept='.png,.jpg,.jpeg'
              />
              <br />
              <br />
              <button
                onClick={async ()=>{
                  if (!newCider || newCider.trim() === '') {
                    console.error('Error: no name');
                    return;
                  }
                  let mongoParam = {
                    name: newCider,
                    rating: newRating,
                    hasImage: false
                  }
                  const Tempfile = image;
                  let mongoResp = {};
                  if (Tempfile) {
                    mongoParam.hasImage = true;
                  }
                  mongoResp =  await axios.post('/api/ratings/cider',mongoParam);
                  if (!mongoParam.hasImage) {
                    console.log('success');
                    return;
                  }
                  let form = new FormData();
                  form.append('myFile', Tempfile);
                  const newImageName = mongoResp.data.insertedId;
                  const submitParams = {
                    name: (newImageName && newImageName !== '') ? newImageName : Tempfile.name,
                    type: Tempfile.type
                  }
                  if (!image) return;
                  if (!submitParams.name || submitParams.name.trim() === '') {
                    console.error('Invalid image name.');
                    return;
                  }
                  const resp = await axios.post('/api/awsSubmit',submitParams);
                  const headers = {
                    "Content-type": Tempfile.type,
                    "Access-Control-Allow-Origin": "*",
                    // "Access-Control-Allow-Methods": "DELETE, POST, GET, PUT",
                    // "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With, Access-Control-Allow-Origin, Access-Control-Allow-Methods",
                  }
                  try {
                    const resultUpload = await axios.put(resp.data.url,Tempfile,{
                      headers: headers
                    });
                    if (resultUpload.status === 200) {
                      console.log('status: success')
                    } else {
                      console.log(`status: ${resultUpload.status}`)
                    }
                  } catch(e){
                    console.log(e)
                  }
                }}
              >
                Add Rating
              </button>
              <br />
              <br />
              <br />
            </div>
            <h2>Ciders</h2>
            <ul
              className={landingPageStyles.bullets}
            >
              {
                ciders.map(item => {
                  return(
                    <li
                      key={item._id}
                    >
                      { `${item.name}: ${item.rating}` }
                      <br/>
                      {
                        item.image && item.hasImage &&
                        <span>
                          <img src={item.image} alt={item.name} />
                          <br />
                        </span>
                      }
                      <br />
                    </li>
                  );
                })
              }
            </ul>
          </div>
        </div>
      </main>
    </div>
  );

}

export async function getServerSideProps() {

  let ciders = {};

  try {
    const client = await clientPromise;
    const db = client.db("ratings");

    const resp = await db
      .collection("cider")
      .find({})
      .sort({ metacritic: -1 })
      .limit(20)
      .toArray();

      ciders = JSON.parse(JSON.stringify(resp));

    // console.log( {
    //     props: { movies: JSON.parse(JSON.stringify(movies)) },
    // })
  } catch (e) {
      console.error(e);
  }

  // Pass data to the page via props
  return { props: { ciders } }
}
