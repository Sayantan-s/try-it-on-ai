import '@/styles/global.css';
import { trpc } from '@/utils/trpc';
import type { AppProps } from 'next/app';
import { Unbounded } from 'next/font/google';
import { Fragment } from 'react';

const font = Unbounded({
  subsets: ['latin'],
  variable: '--font-ub',
});

function App({ Component, pageProps }: AppProps) {
  return (
    <Fragment>
      <style jsx global>
        {`
          :root {
            --font-ub: ${font.style.fontFamily};
          }
        `}
      </style>
      <Component {...pageProps} />
    </Fragment>
  );
}

export default trpc.withTRPC(App);
