import { AppProps } from 'next/app'
import { NextPage } from 'next'
import Head from 'next/head'
import img from '../../public/icon.svg'
import favicon from '../../public/icon.svg'

import '../../styles/main.css'

const MyApp: NextPage<AppProps> = ({ Component, pageProps }) => {
	return (
		<>
			<Head>
				<title>PR View</title>
				<meta charSet="utf-8" />
				<meta
					name="viewport"
					content="initial-scale=1.0, width=device-width"
				/>
				<link rel="shortcut icon" href={favicon} />
			</Head>
			<>
				<nav className="flex items-center justify-between flex-wrap bg-teal-700 p-6">
					<div className="flex items-center flex-shrink-0 text-white mr-6">
						<img
							className="mr-2"
							src={img}
							height="42"
							width="42"
						/>
						<span className="font-semibold text-xl tracking-tight">
							PR View
						</span>
					</div>

					<div className="w-full  flex-grow lg:flex lg:items-center lg:w-auto">
						<div className="text-sm lg:flex-grow">
							<a
								href="#responsive-header"
								className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4"
							>
								Configuration
							</a>
						</div>
					</div>

					<div className="w-full flex justify-end flex-grow lg:flex lg:items-center lg:w-auto">
						<a
							href="https://github.com/magoo-magoo/pr-view"
							className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4"
						>
							GitHub
						</a>
					</div>
				</nav>
				<Component {...pageProps} />
			</>
		</>
	)
}

export default MyApp
