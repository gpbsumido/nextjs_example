import Head from 'next/head'
import Link from 'next/link'
import styles from '../styles/Home.module.css';
import landingPageStyles from '../styles/LandingPage.module.css';
import searchBoxStyles from '../styles/SearchBox.module.css';
import PhotoPost from '../components/photoPost';
import S3 from 'aws-sdk/clients/s3'
import { useState, useEffect } from 'react'
import { toast } from 'react-toastify';
import RefmintClient from 'refmint-sdk'
import REFMINT, { ORDER_BY_SELECTION }  from 'refmint-sdk'

export default function Home({ urlsWithKeys, continuationKey, finishedLoading }) {

  console.log(REFMINT)

  const s3 = new S3({
    region: 'ca-central-1',
    accessKeyId: process.env.NEXT_PUBLIC_ACCESS_KEY,
    secretAccessKey: process.env.NEXT_PUBLIC_SECRET_KEY,
    signatureVersion: "v4"
  });

  var refmint = new RefmintClient({
    apiKey: '1cR7jRsiydJUJk495PXo5U8CyUc0I2c9eC7mpgwMwVIbjbBsfbP0cG2kAeiTZJpN',
    baseUrl: 'https://test.refmint.xyz'
  })

  const [imageURLs,setImageURLs] = useState(urlsWithKeys);
  const [contKey,setContKey] = useState(continuationKey);
  const [fiinishedList,setFinishedList] = useState(finishedLoading);
  const [searchTerm,setSearchTerm] = useState('');

  useEffect(() => {

    //get referral leaderboard
    refmint.leaderboard('3verse','publicbeta','referral',10,1,false)
      .then((resp) => {
        console.log(resp)
      }).catch(e => {
        console.log(e);
      });

  }, []);

  async function removeImage(key){
    const bucketParams = {
      Bucket: process.env.NEXT_PUBLIC_BUCKET_NAME,
      Key: key,
    };
    try {
      await s3.deleteObject(bucketParams).promise()
      toast.success("Success. Object deleted.");
      setImageURLs(prevState =>{
        if (!prevState) return [];
        const newState =  prevState.filter(item => item.key !== key);
        return newState;
      })
    } catch (err) {
      toast.error("Error", err);
    }
  }

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
                <Link href="/ratings/ciders">Cider Ratings</Link>
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
            <div className={searchBoxStyles.searchBoxDiv}>
              <p>Image Key Search</p>
              <input
                onChange={(e)=>{
                  setSearchTerm(e.target.value)
                }}
                type='text'
              />
              <div>
                <button
                  onClick={ async () => {
                    if (searchTerm.trim() === '') return;
                    const s3params = {
                      Bucket: process.env.NEXT_PUBLIC_BUCKET_NAME,
                      MaxKeys: 3,
                      Prefix: searchTerm
                    };
                    const response = await s3.listObjectsV2(s3params).promise();
                    setFinishedList(!response.IsTruncated);
                    setContKey(response.NextContinuationToken);
                    let temp = response.Contents?.map(item => item.Key);
                    let keys = temp.map(async image => {
                      const param = {
                        Bucket: process.env.NEXT_PUBLIC_BUCKET_NAME,
                        Key: image,
                        Expires: 600,
                      };
                      return await s3.getSignedUrlPromise("getObject",param);
                    });
                    const newURLs = await Promise.all(keys);
                    const urlsWithKeys = newURLs.map((url,index) =>{
                      return {
                        url: url,
                        key: temp[index]
                      }
                    })
                    setImageURLs(urlsWithKeys);
                  }}
                >
                  Search
                </button>
                <button
                  onClick={async()=>{
                    if (searchTerm.trim() === '') return;
                    const s3params = {
                      Bucket: process.env.NEXT_PUBLIC_BUCKET_NAME,
                      MaxKeys: 3,
                    };
                    const response = await s3.listObjectsV2(s3params).promise();
                    setFinishedList(!response.IsTruncated);
                    setContKey(response.NextContinuationToken);
                    let temp = response.Contents?.map(item => item.Key);
                    let keys = temp.map(async image => {
                      const param = {
                        Bucket: process.env.NEXT_PUBLIC_BUCKET_NAME,
                        Key: image,
                        Expires: 600,
                      };
                      return await s3.getSignedUrlPromise("getObject",param);
                    });
                    const newURLs = await Promise.all(keys);
                    const urlsWithKeys = newURLs.map((url,index) =>{
                      return {
                        url: url,
                        key: temp[index]
                      }
                    })
                    setImageURLs(urlsWithKeys);
                  }}
                >
                  Clear
                </button>
              </div>
            </div>

            {
              imageURLs.map((item,index) =>{
                return (
                  <PhotoPost
                    key={index}
                    image={item.url}
                    text={item.key}
                    date={undefined}
                    removeImage={removeImage}
                  />
                );
              })
            }
            {
              !fiinishedList &&
              <button
                className={landingPageStyles.loadMore}
                onClick={async ()=>{
                  const s3params = {
                    Bucket: process.env.NEXT_PUBLIC_BUCKET_NAME,
                    MaxKeys: 3,
                  };
                  if (contKey) s3params.ContinuationToken = contKey;
                  if (searchTerm !== '') {
                    s3params.Prefix = searchTerm;
                  }
                  const response = await s3.listObjectsV2(s3params).promise();
                  setFinishedList(!response.IsTruncated);
                  setContKey(response.NextContinuationToken);
                  let temp = response.Contents?.map(item => item.Key);
                  let keys = temp.map(async image => {
                    const param = {
                      Bucket: process.env.NEXT_PUBLIC_BUCKET_NAME,
                      Key: image,
                      Expires: 600,
                    };
                    return await s3.getSignedUrlPromise("getObject",param);
                  });
                  const newURLs = await Promise.all(keys);
                  const urlsWithKeys = newURLs.map((url,index) =>{
                    return {
                      url: url,
                      key: temp[index]
                    }
                  })
                  setImageURLs(prevState =>{
                    if (!prevState) {
                      return urlsWithKeys;
                    } else {
                      return prevState.concat(urlsWithKeys);
                    }
                  });
                }}
              >
                Load more...
              </button>
            }
          </div>
        </div>
      </main>

      <footer
        // className={styles.footer}
      >
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <img src="/vercel.svg" alt="Vercel" className={styles.logo} />
        </a>
      </footer>
    </div>
  )
}

export async function getServerSideProps() {

  const s3 = new S3({
    region: 'ca-central-1',
    accessKeyId: process.env.NEXT_PUBLIC_ACCESS_KEY,
    secretAccessKey: process.env.NEXT_PUBLIC_SECRET_KEY,
    signatureVersion: "v4"
  })

  var params = {
    Bucket: process.env.NEXT_PUBLIC_BUCKET_NAME,
    MaxKeys: 3
  };
  const list_promise = await s3.listObjectsV2(params).promise();
  const images = {
    items: list_promise.Contents.filter(item => item.Key.trim() !== '').map(item =>{
      return item.Key;
    }),
    continuationKey: list_promise.NextContinuationToken
  }
  const keys = images.items.map(async image => {
    const param = {
      Bucket: process.env.NEXT_PUBLIC_BUCKET_NAME,
      Key: image,
      Expires: 600,
    };
    return await s3.getSignedUrlPromise("getObject",param);
  });
  const urls = await Promise.all(keys);
  const urlsWithKeys = urls.map((url,index) =>{
    return {
      url: url,
      key: images.items[index]
    }
  })
  let continuationKey = null;
  if (images.continuationKey) continuationKey = images.continuationKey;
  let finishedLoading = images.continuationKey === undefined;
  // Pass data to the page via props
  return { props: { urlsWithKeys, continuationKey, finishedLoading } }
}