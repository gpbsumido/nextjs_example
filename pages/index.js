import Head from 'next/head'
import Link from 'next/link'
import styles from '../styles/Home.module.css';
import landingPageStyles from '../styles/LandingPage.module.css';
import KarenLake from '../assets/DSC_4264.jpeg';
import LionDance from '../assets/DSC_5261.jpeg';
import PhotoPost from '../components/photoPost';

export default function Home() {


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
              posts.map( (item,index) => {
                return (
                  <PhotoPost
                    key={index}
                    image={item.image}
                    text={item.text}
                    date={item.date}
                  />
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