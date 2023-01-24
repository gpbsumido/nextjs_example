import axios from 'axios';
import Head from 'next/head'
import Link from 'next/link'
import GamePage from '../components/gamepage';
import styles from '../styles/Home.module.css';
import landingPageStyles from '../styles/LandingPage.module.css';
import clientPromise from '../utils/mongo';

export default function SecondPage({data, movies}){

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
            </ul>
          </div>
          <div
            className={landingPageStyles.centerPanel}
          >
            <p>Games</p>
            <br />
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
            <br />
            <p>
              Restaurants
            </p>
            <br />
            <ul
              className={landingPageStyles.bullets}
            >
              {
                movies.map(item => {
                  return(
                    <li
                      key={item._id}
                    >
                      { item.name }
                    </li>
                  );
                })
              }
            </ul>
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
  );

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
  let data = res.data;

  let movies = {};

  try {
    const client = await clientPromise;
    const db = client.db("sample_restaurants");

    const resp = await db
      .collection("restaurants")
      .find({})
      .sort({ metacritic: -1 })
      .limit(20)
      .toArray();

    movies = JSON.parse(JSON.stringify(resp));

    // console.log( {
    //     props: { movies: JSON.parse(JSON.stringify(movies)) },
    // })
  } catch (e) {
      console.error(e);
  }

  // Pass data to the page via props
  return { props: { data, movies } }
}
