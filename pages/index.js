import Head from 'next/head'
import Link from 'next/link'
import styles from '../styles/Home.module.css';
import landingPageStyles from '../styles/LandingPage.module.css';
import PhotoPost from '../components/photoPost';
import S3 from 'aws-sdk/clients/s3'
import { useState } from 'react'

export default function Home({ urlsWithKeys, continuationKey, finishedLoading }) {

  const [imageURLs,setImageURLs] = useState(urlsWithKeys);
  const [contKey,setContKey] = useState(continuationKey);
  const [fiinishedList,setFinishedList] = useState(finishedLoading);

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
                <Link href="/second">List of restaurants and games</Link>
              </li>
              <li>
                <Link href="/submissionAws">Add new Image</Link>
              </li>
            </ul>
          </div>
          <div
            className={landingPageStyles.centerPanel}
          >
            {
              imageURLs.map((item,index) =>{
                return (
                  <PhotoPost
                    key={index}
                    image={item.url}
                    text={item.key}
                    date={undefined}
                  />
                );
              })
            }
            {
              !fiinishedList &&
              <button
                onClick={async ()=>{
                  const s3 = new S3({
                    region: 'ca-central-1',
                    accessKeyId: process.env.NEXT_PUBLIC_ACCESS_KEY,
                    secretAccessKey: process.env.NEXT_PUBLIC_SECRET_KEY,
                    signatureVersion: "v4"
                  })
                  const s3params = {
                    Bucket: process.env.NEXT_PUBLIC_BUCKET_NAME,
                    MaxKeys: 3,
                    ContinuationToken: contKey 
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

async function getBucketList(s3){

  var params = {
    Bucket: process.env.NEXT_PUBLIC_BUCKET_NAME,
    MaxKeys: 3
  };
  const list = await s3.listObjectsV2(params).promise();
  return {
    items: list.Contents.map(item =>{
      return item.Key;
    }),
    continuationKey: list.NextContinuationToken
  }
}

export async function getServerSideProps() {


  const s3 = new S3({
    region: 'ca-central-1',
    accessKeyId: process.env.NEXT_PUBLIC_ACCESS_KEY,
    secretAccessKey: process.env.NEXT_PUBLIC_SECRET_KEY,
    signatureVersion: "v4"
  })

  let images = await getBucketList(s3);
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
  const continuationKey = images.continuationKey;
  let finishedLoading = images.continuationKey === undefined;
  // Pass data to the page via props
  return { props: { urlsWithKeys, continuationKey, finishedLoading } }
}
