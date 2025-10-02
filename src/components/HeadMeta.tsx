// PATH: components/HeadMeta.tsx
import Head from 'next/head';

export default function HeadMeta() {
    return (
        <Head>
            <meta name="robots" content="noindex, nofollow, noai, noimageai" />
        </Head>
    );
}
