import Head from 'next/head'
import Link from 'next/link'
import styles from '../styles/Home.module.css';
import landingPageStyles from '../styles/LandingPage.module.css';
import KarenLake from '../assets/DSC_4264.jpeg';
import LionDance from '../assets/DSC_5261.jpeg';
import PhotoPost from '../components/photoPost';
import S3 from 'aws-sdk/clients/s3'

export default function Home({ urls }) {


  const posts = [
    {
      image: LionDance,
      text: `Went to the Port Moody Farmer's Market on Chinese Lunar New Year. Saw a Lion Dancing.`,
      date: '2023-01-22'
    },
    {
      image: KarenLake,
      text: `Little hike up North Van. T'was cold. Saw some people fishing.`,
      date: '2022-05-18'
    }
  ];

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
            <p
              className={landingPageStyles.fill}
            >
              This is the landing page will include some of the photos that Paul takes on his Nikon Z5 camera.
            </p>
            <p>
              Links
            </p>
            <ul>
              <li>
                <Link href="/second">List of restaurants and games</Link>
              </li>
            </ul>
          </div>
          <div
            className={landingPageStyles.centerPanel}
          >
            {
              urls.map((url,index) =>{
                return (
                  <PhotoPost
                    key={index}
                    image={url}
                    text={url}
                    date={undefined}
                  />
                  // <img src={url}/>
                );
              })
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
    Bucket: process.env.BUCKET_NAME
  };
  const list = await s3.listObjectsV2(params).promise();
  return list.Contents.map(item =>{
    // console.log(item.Key)
    return item.Key;
  })
}

export async function getServerSideProps() {


  const s3 = new S3({
    region: 'ca-central-1',
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_KEY,
    signatureVersion: "v4"
  })

  let images = await getBucketList(s3);

  const keys = images.map(async image => {
    const param = {
      Bucket: process.env.BUCKET_NAME,
      Key: image,
      Expires: 600,
    };
    return await s3.getSignedUrlPromise("getObject",param);
  });
  const urls = await Promise.all(keys);

  // Pass data to the page via props
  return { props: { urls } }
}
