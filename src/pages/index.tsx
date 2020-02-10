import * as React from 'react'
import { NextPage } from 'next'
import { pullRequestsService } from '../services/pullRequestService'
import { PullRequestCard } from '../components/PullRequestCard'
import { useRouter } from 'next/router'
import { PullRequest } from '../services/pullRequest'

const defaultQuery = 'is:open org:magoo-magoo'

type Props = {
	pullRequests: PullRequest[]
}
const HomePage: NextPage<Props> = ({ pullRequests }) => {

	const router = useRouter()
	const [query, setQuery] = React.useState(router.query.query)

	React.useEffect(() => {
		if (!query) {
			router.push('/', `/?query=${defaultQuery}`, { shallow: true })
			setQuery(defaultQuery)
		}
	}, [router, query])
	return (
		<div className="w-auto">
			<div className="flex justify-center my-3">
				<div className="ml-0 bg-gray-200 border-teal-300 rounded-full my-2 px-4 max-w-sm mr-4">
					<p>
						Opened: {pullRequests.length}, Mergeable:{' '}
						{
							pullRequests.filter(
								x => x.mergeable === 'MERGEABLE'
							).length
						}
					</p>
				</div>
				<input
					value={query}
					onChange={e => setQuery(e.target.value)}
					className="w-1/2 bg-white shadow focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 block appearance-none leading-normal mr-2"
				/>
				<button
					onClick={() => (location.href = `/?query=${query}`)}
					className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
				>
					Update
				</button>
			</div>
			<div className="flex flex-wrap justify-center">
				{pullRequests.map((pr, i) => (
					<div
						key={i}
						className="flex w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 mb-4 m-2"
					>
						<PullRequestCard pullRequest={pr} />
					</div>
				))}
			</div>
		</div>
	)
}

HomePage.getInitialProps = async ctx => {
	let query: string = defaultQuery
	if (ctx.query.query) {
		query =
			typeof ctx.query.query === 'string'
				? ctx.query.query
				: ctx.query.query[0]
	} else {
	}

	const pullRequests = await pullRequestsService.getAll(
		typeof query === 'string' ? query : query[0]
	)
	return { pullRequests }
}

export default HomePage
