import React from 'react'
import Head from 'next/head'
import focusSource from 'ally.js/amd/style/focus-source'

import '@/styles/globals.css'
import '../utils/fontawesome'

function App({ Component, pageProps }) {
  React.useEffect(() => {
    focusSource()
  }, [])

  return (
    <>
      <Head>
        <title>Entur Case - NLT</title>
        <meta
          name='description'
          content='Entur-Case: En React-nettside som viser sanntidsavganger fra ulike stopp i byen ved hjelp av Entur sine API-er.'
        />
        <meta
          name='robots'
          content='noindex, nofollow, max-snippet:-1, max-image-preview:large, max-video-preview:-1'
        />
        <meta name='viewport' content='width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0' />
      </Head>
      <Component {...pageProps} />
    </>
  )
}

export default App
