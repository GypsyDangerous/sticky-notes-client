import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

import GlobalStyle from '../styles/global.styles';

function MyApp({ Component, pageProps }) {
	const router = useRouter();

	useEffect(() => {
		(async () => {
			if (typeof window !== "undefined" && !router.asPath.includes("initial")) {
				if (document.querySelector(".titlebar")) return;
				const customTitlebar = await import("custom-electron-titlebar");

				let myTitleBar = new customTitlebar.Titlebar({
					backgroundColor: customTitlebar.Color.fromHex("#17181ba1"),
					maximizable: false,
					minimizable: false,
					menu: null,
				});
				myTitleBar.updateTitle("");
			}
		})();
	}, []);

	return (
		<>
			<Head>
				<meta charSet="utf-8" />
				<link rel="icon" href="/logo.png" />
				<link
					rel="preload"
					href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
					as="style"
				/>
				<link rel="preload" href="https://api.disstreamchat.com/fonts" as="style" />
				<link href="https://api.disstreamchat.com/fonts" rel="stylesheet" />
				<link
					href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
					rel="stylesheet"
				/>
				<link
					rel="preload"
					href="https://cdn.jsdelivr.net/gh//GypsyDangerous/simple-css-reset/reset.css"
					as="style"
				/>
				<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh//GypsyDangerous/simple-css-reset/reset.css" />
				<link
					rel="stylesheet"
					href="https://cdnjs.cloudflare.com/ajax/libs/nprogress/0.2.0/nprogress.css"
					integrity="sha512-DanfxWBasQtq+RtkNAEDTdX4Q6BPCJQ/kexi/RftcP0BcA4NIJPSi7i31Vl+Yl5OCfgZkdJmCqz+byTOIIRboQ=="
					crossOrigin="anonymous"
				/>
				<link
					rel="preload"
					as="style"
					href="https://cdnjs.cloudflare.com/ajax/libs/nprogress/0.2.0/nprogress.css"
					integrity="sha512-DanfxWBasQtq+RtkNAEDTdX4Q6BPCJQ/kexi/RftcP0BcA4NIJPSi7i31Vl+Yl5OCfgZkdJmCqz+byTOIIRboQ=="
					crossOrigin="anonymous"
				/>
				<title></title>
			</Head>
			<GlobalStyle />
			<Component {...pageProps} />
		</>
	);
}

const App = ({ Component, pageProps }) => {
	return <MyApp Component={Component} pageProps={pageProps}></MyApp>;
};

export default App;
