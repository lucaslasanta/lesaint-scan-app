import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head>
        {/* Google Fonts */}
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@300;400&family=Inter:wght@300;400;500&display=swap"
          rel="stylesheet"
        />

        {/* FIX iOS MOBILE ZOOM + CONTENT SHIFTING */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
      </Head>

      <body style={{ margin: 0, backgroundColor: "black" }}>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
