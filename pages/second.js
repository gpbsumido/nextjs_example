import axios from 'axios';
import GamePage from '../components/gamepage';import Head from 'next/head'
import styles from '../styles/Home.module.css';
import landingPageStyles from '../styles/LandingPage.module.css';

export default function SecondPage(){
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
            <h2>Let's get started!</h2>
            <p>
              This is a secondary page for the photography site.
            </p>
            </div>
          <div
            className={landingPageStyles.centerPanel}
          >
            {
              data.map((item,index) => {
                return(
                  <GamePage
                    key={index}
                    props={item}
                    index={index}
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

export async function getServerSideProps() {
  // Fetch data from external API
  const res = await axios.get('https://test.refmint.xyz/api/game_projects/projects',{
    params: {
      page_size: 10,
      page: 1,
      status: 'ACTIVE'
    }
  })
  let data = res.data

  // Pass data to the page via props
  return { props: { data } }
}