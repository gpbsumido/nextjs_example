import Head from 'next/head'
import styles from '../styles/Home.module.css';
import landingPageStyles from '../styles/LandingPage.module.css';
import KarenLake from '../assets/DSC_4264.jpeg'
import Image from 'next/image'

export default function Home() {
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
              This is the landing page will include some of the photos that Paul takes on his Nikon Z5 camera.
            </p>
            </div>
          <div
            className={landingPageStyles.centerPanel}
          >
            <Image
              src={KarenLake}
            />
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