import axios from 'axios';
import Head from 'next/head'
import { useState } from 'react'
import styles from '../styles/Home.module.css';
import landingPageStyles from '../styles/LandingPage.module.css';

export default function Submission(){

  const [image,setImage] = useState();

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
            <form
              action='/api/formSubmit'
              method='POST'
            >
              <input type='text' onChange={(e)=>{
                setImage(e.target.value);
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
              <button type="submit" onClick={async (e)=>{
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
                  const file = new File([''],Tempfile,{
                    type: 'image/png'
                  });
                  let form = new FormData();
                  form.append('myFile', Tempfile)
                  // const response = await fetch('/api/formSubmit', {
                  //     method: 'POST',
                  //     body: form
                  // })
                  const response = await axios.post('/api/formSubmit', form);
                  if (response.status === 200) {
                    console.log('success')
                  }
              }}>
                Submit
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