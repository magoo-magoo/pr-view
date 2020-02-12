import { AppProps } from 'next/app'
import { NextPage } from 'next'
import Head from 'next/head'
import img from '../../public/icon.svg'
import favicon from '../../public/icon.svg'

import '../../styles/main.css'

const MyApp: NextPage<AppProps> = ({ Component, pageProps }) => {
	return (
		<div className="bg-blue-300">
			<Head>
				<title>PR View</title>
				<meta charSet="utf-8" />
				<meta
					name="viewport"
					content="initial-scale=1.0, width=device-width"
				/>
				<link rel="shortcut icon" href={favicon} />
				<style>
					{`@keyframes spinner {
						to {transform: rotate(360deg);}
						}
						
						.spinner {
						animation: spinner .6s linear infinite;
						}`}
				</style>
			</Head>
			<nav className="flex items-center justify-between flex-wrap p-6">
				<a href="/">
					<div className="flex items-center flex-shrink-0 text-blue-800 mr-6">
						<img className="mr-2 w-8 h-8 sm:w-8 sm:h-8" src={img} />
						<span className="font-semibold text-xl tracking-tight">
							PR View
						</span>
					</div>
				</a>

				<div className="lg:flex lg:items-center lg:w-auto">
					<div className="text-sm lg:flex-grow">
						<a
							href="/configuration"
							className="block mt-4 lg:inline-block lg:mt-0 text-blue-800 hover:text-white mr-4"
						>
							Configuration
						</a>
					</div>
				</div>

				<div className="flex justify-end flex-grow lg:flex lg:items-center lg:w-auto">
					<a
						href="https://github.com/magoo-magoo/pr-view"
						className="block mt-4 lg:inline-block lg:mt-0 text-blue-800 hover:text-white mr-4"
					>
						GitHub
					</a>
				</div>
			</nav>
			<Component {...pageProps} />
		</div>
	)
}

export default MyApp
