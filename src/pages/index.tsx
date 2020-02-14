import * as React from 'react'
import { NextPage } from 'next'
import { pullRequestsService } from '../core/pullRequestService'
import { PullRequestCard } from '../components/PullRequestCard'
import { useRouter } from 'next/router'
import { PullRequest, PageInfo } from '../core/pullRequest'
import { parseCookies } from 'nookies'
import refreshIcon from '../../public/refresh.svg'
import InfiniteScroll from 'react-infinite-scroller'
import { authenticate, extractToken } from '../core/authentication'
import { useWindowSize } from 'react-use'
import { useState, useEffect } from 'react'
import { notNullOrUndefined } from '../core/utils'
import { Loading } from '../components/Loading'

const defaultQuery = 'is:open org:facebook'

type Props = {
	initialLoad: readonly PullRequest[]
	pageInfo: PageInfo
}
const HomePage: NextPage<Props> = ({ initialLoad, pageInfo }) => {
	const { push, query } = useRouter()
	const { height } = useWindowSize()

	const [githubQuery, setGithubQuery] = useState(
		notNullOrUndefined(query.query)
			? typeof query.query === 'string'
				? query.query
				: query.query[0]
			: ''
	)
	const [canScroll, SetCanScroll] = useState(pageInfo.hasNextPage)
	const [items, setItems] = useState(initialLoad)
	const [lastItem, setLastItem] = useState(pageInfo.endCursor)
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		console.log({ githubQuery })
		if (!githubQuery) {
			push(`/?query=${defaultQuery}`, `/?query=${defaultQuery}`, {
				shallow: true,
			})
			console.log('reset')
			setGithubQuery(defaultQuery)
		}
		setLoading(false)
	}, [githubQuery])

	useEffect(() => {
		setItems(initialLoad)
	}, [initialLoad])

	const updateQuery = () => {
		push(`/?query=${githubQuery}`)
		setLoading(true)
	}

	const loadMoreItems = async () => {
		const { gh_access_token: cookie } = parseCookies()

		const results = await getPullRequests(
			githubQuery,
			extractToken(cookie),
			lastItem
		)

		setLoading(false)
		
		if (!results) {
			return
		}

		setItems([...items, ...results.pullRequests.filter(notNullOrUndefined)])
		setLastItem(results.pageInfo.endCursor)
		SetCanScroll(results.pageInfo.hasNextPage)
	}

	return (
		<div className="w-auto">
			<div className="flex justify-center my-3">
				<input
					value={githubQuery}
					onChange={e => setGithubQuery(e.target.value)}
					onKeyPress={event => {
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
			<InfiniteScroll
				className="flex flex-wrap justify-center"
				pageStart={0}
				loadMore={loadMoreItems}
				hasMore={canScroll}
				initialLoad={true}
				threshold={height}
				loader={<Loading key={'loading-element'} />}
			>
				<div className="flex flex-wrap justify-center">
					{items.map((pr, i) => (
						<PullRequestCard key={i} pullRequest={pr} />
					))}
				</div>
			</InfiniteScroll>
		</div>
	)
}

HomePage.getInitialProps = async ctx => {
	const { gh_access_token: cookie } = parseCookies(ctx)
	if (cookie) {
		let query: string = defaultQuery
		if (ctx.query.query) {
			query =
				typeof ctx.query.query === 'string'
					? ctx.query.query
					: ctx.query.query[0]
		}

		const effectiveQuery = typeof query === 'string' ? query : query[0]

		const results = await getPullRequests(
			effectiveQuery,
			extractToken(cookie)
		)
		if (results) {
			return {
				initialLoad: results.pullRequests.filter(notNullOrUndefined),
				pageInfo: results.pageInfo,
			}
		}
	}

	await authenticate(ctx)

	return {
		initialLoad: [],
		pageInfo: {
			hasNextPage: false,
			hasPreviousPage: false,
			endCursor: '',
			startCursor: '',
		},
	}
}

async function getPullRequests(
	effectiveQuery: string,
	token: string,
	after: string | null = null
) {
	const pullRequests = await pullRequestsService.getAll(
		effectiveQuery,
		token,
		after
	)
	return pullRequests
}

export default HomePage
