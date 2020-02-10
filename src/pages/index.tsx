import * as React from 'react'
import { NextPage } from 'next'
import { pullRequestsService } from '../services/pullRequestService'
import { PullRequestCard } from '../components/PullRequestCard'
import Router from 'next/router'
import { PullRequest } from '../services/pullRequest'

const defaultQuery = 'org:magoo-magoo'

type Props = {
	pullRequests: PullRequest[]
}
const HomePage: NextPage<Props> = ({ pullRequests }) => {
	React.useEffect(() => {
		if (!Router.query.query) {
			Router.push('/', `/?query=${defaultQuery}`, { shallow: true })
		}
	}, [])
	return (
		<div className="">
			<div className="bg-gray-300 mx-auto border-teal-300 rounded-full my-2 px-4 max-w-sm ">
				<p>
					Opened: {pullRequests.length}, Mergeable:{' '}
					{
						pullRequests.filter(x => x.mergeable === 'MERGEABLE')
							.length
					}
				</p>
			</div>

			<div className="flex flex-wrap justify-center">
				{pullRequests.map((pr, i) => (
					<div
						key={i}
						className="flex sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 mb-4 m-2"
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
