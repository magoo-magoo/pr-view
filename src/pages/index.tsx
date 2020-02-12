import * as React from 'react'
import { NextPage } from 'next'
import { pullRequestsService } from '../services/pullRequestService'
import { PullRequestCard } from '../components/PullRequestCard'
import { useRouter } from 'next/router'
import { PullRequest } from '../services/pullRequest'
import { parseCookies } from 'nookies'
import refreshIcon from '../../public/refresh.svg'
import { ParsedUrlQuery } from 'querystring'
import {
	authenticate,
	extractToken,
} from '../core/authentication'

const defaultQuery = 'is:open org:magoo-magoo'

type Props = {
	pullRequests: PullRequest[]
}
const HomePage: NextPage<Props> = ({ pullRequests }) => {
	const { push, query } = useRouter()
	const [githubQuery, setGithubQuery] = React.useState(
		query.query ? query.query : ''
	)
	const [loading, setLoading] = React.useState(false)

	React.useEffect(() => {
		if (!githubQuery) {
			push(`/?query=${defaultQuery}`, `/?query=${defaultQuery}`, {
				shallow: true,
			})
			setGithubQuery(defaultQuery)
		}
		setLoading(false)
	}, [githubQuery, pullRequests])

	const updateQuery = () => {
		push(`/?query=${githubQuery}`)
		setLoading(true)
	}
	return (
		<div className="w-auto">
			<div className="flex justify-center my-3">
				<input
					value={githubQuery}
					onChange={e => setGithubQuery(e.target.value)}
					onKeyPress={event => {
						console.log({ event })
						if (event.key === 'Enter') {
							updateQuery()
						}
					}}
					className="lg:w-1/3 bg-blue-100 shadow focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 block appearance-none leading-normal mr-2"
				/>
				<button
					onClick={updateQuery}
					className="bg-blue-500 w-24 flex justify-center hover:bg-blue-400 text-blue-800 font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
				>
					{loading ? (
						<img
							className="spinner fill-current text-white"
							src={refreshIcon}
						/>
					) : (
						'Update'
					)}
				</button>
			</div>
			<div className="flex flex-wrap justify-center">
				{pullRequests.map((pr, i) => (
					<div
						key={i}
						className="flex w-full justify-center sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 mb-4 m-2"
					>
						<PullRequestCard pullRequest={pr} />
					</div>
				))}
			</div>
		</div>
	)
}

HomePage.getInitialProps = async ctx => {
	const { gh_access_token: cookie } = parseCookies(ctx)
	if (cookie) {
		const pullRequests = await getPullRequests(ctx.query, cookie)
		if (pullRequests) {
			return { pullRequests }
		}
	}

	await authenticate(ctx)

	return { pullRequests: [] }
}

async function getPullRequests(parsedUrlQuery: ParsedUrlQuery, cookie: string) {
	let query: string = defaultQuery
	if (parsedUrlQuery.query) {
		query =
			typeof parsedUrlQuery.query === 'string'
				? parsedUrlQuery.query
				: parsedUrlQuery.query[0]
	}
	const pullRequests = await pullRequestsService.getAll(
		typeof query === 'string' ? query : query[0],
		extractToken(cookie)
	)
	return pullRequests
}

export default HomePage
