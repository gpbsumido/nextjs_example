import axios from 'axios';
import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import styles from '../styles/Home.module.css';
import landingPageStyles from '../styles/LandingPage.module.css';

export default function SubmissionAws(){

  const [image,setImage] = useState();
  const [imageName,setImageName] = useState();

  return (
    <div className={styles.container}>
      <Head>
        <title>Submission Page</title>
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
                <Link href="/second">List of restaurants and games</Link>
              </li>
            </ul>
          </div>
          <div
            className={landingPageStyles.centerPanel}
          >
            <form
              // action='/api/awsSubmit'
              // method='POST'
            >
              <input type='text' onChange={(e)=>{
                setImageName(e.target.value);
              }}/>
              <input
                // ref={hiddenFileInputDisplay}
                // style= {{display: 'none'}}
                type="file"
                onChange={(e)=> {
                  if (e.target.files && e.target.files[0]) {
                    if (e.target.files[0].size > 10000000) {
                      toast.error('Project Image must be no greater than 10mb.');
                      return;
                    }
                    setImage(e.target.files[0]);
                    // if (setStoredImageId) setStoredImageId(undefined);
                  }
                }}
                accept='.png,.jpg,.jpeg'
              />
              <button
                onClick={async (e)=>{
                e.preventDefault();
                  const Tempfile = image;
                  if (!Tempfile) {
                      return
                  }
                  // check file size
                  // const size = parseInt(((Tempfile.size/1024)/1024).toFixed(4))
                  // if (size > 16) {
                  //     popupHandler("File too large!")
                  // }
                  // let file =  new File([Tempfile.slice(0, Tempfile.size, 'application/pdf')], `${fileName}.png`, {type: 'image/png'});
                  let form = new FormData();
                  form.append('myFile', Tempfile);

                  const resp = await axios.post('/api/awsSubmit', {
                    name: (imageName && imageName !== '') ? imageName : Tempfile.name,
                    type: Tempfile.type
                  });
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
              }}>
                Upload
              </button>
            </form>
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