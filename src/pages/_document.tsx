import Document, { Head, Html, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head />
        <body>
          <div id="modals"></div>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
