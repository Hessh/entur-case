import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html lang='nb-NO'>
        <Head>
          <link rel='icon' href='/next.svg' sizes='512x512' />
          <link rel='apple-touch-icon' href='/next.svg' />
        </Head>
        <body>
          <Main />
          <NextScript />
          <div id='modal-root' />
        </body>
      </Html>
    )
  }
}

export default MyDocument
