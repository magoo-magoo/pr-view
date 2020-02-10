import { AppProps } from 'next/app'
import { NextPage } from 'next'
import Head from 'next/head'
import img from '../../public/icon.svg'
import favicon from '../../public/favicon.ico'

import '../../styles/main.css'

const MyApp: NextPage<AppProps> = ({ Component, pageProps }) => {
	return (
		<>
			<Head>
				<link rel="shortcut icon" href={favicon} />
			</Head>
			<div>
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
					<div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
						<div className="text-sm lg:flex-grow">
							<a
								href="#responsive-header"
								className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4"
							>
								Configuration
							</a>
						</div>
					</div>
				</nav>
				<Component {...pageProps} />
			</div>
		</>
	)
}

export default MyApp
