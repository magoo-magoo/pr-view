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
import { ParsedUrlQuery } from 'querystring'

const defaultQuery = 'is:open org:facebook'

type Props = {
	initialLoad: readonly PullRequest[]
	initialPageInfo: PageInfo
}

const extractGithubQueryFromUrl = (query: ParsedUrlQuery) =>
	notNullOrUndefined(query.query)
		? typeof query.query === 'string'
			? query.query
			: query.query[0]
		: ''

const HomePage: NextPage<Props> = ({ initialLoad, initialPageInfo }) => {
	const { push, query: routerParsedUrlQuery } = useRouter()
	const { height } = useWindowSize()

	const [githubQuery, setGithubQuery] = useState(
		extractGithubQueryFromUrl(routerParsedUrlQuery)
	)
	const [canScroll, SetCanScroll] = useState(initialPageInfo.hasNextPage)
	const [items, setItems] = useState(initialLoad)
	const [lastItem, setLastItem] = useState(initialPageInfo.endCursor)
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		if (!githubQuery) {
			push(`/?query=${defaultQuery}`, `/?query=${defaultQuery}`, {
				shallow: true,
			})
			setGithubQuery(defaultQuery)
		}
	}, [githubQuery, initialLoad])

	useEffect(() => {
		setLoading(false)
		setItems(initialLoad)
		setLastItem(undefined)
		setGithubQuery(extractGithubQueryFromUrl(routerParsedUrlQuery))
		setLastItem(initialPageInfo.endCursor)
	}, [initialLoad, initialPageInfo])

	useEffect(() => {
		setLoading(false)
	}, [items])

	const updateQuery = () => {
		setLoading(true)
		push(`/?query=${githubQuery}`)
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

		setItems([...items, ...results.pullRequests])
		setLastItem(results.pageInfo.endCursor)
		SetCanScroll(results.pageInfo.hasNextPage)
	}

	return (
		<div className="w-auto">
			<div className="flex flex-wrap justify-center my-3">
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
				className="mx-4 flex flex-wrap justify-center"
				pageStart={0}
				loadMore={loadMoreItems}
				hasMore={canScroll}
				initialLoad={true}
				threshold={height}
				loader={<Loading key={'loading-element'} />}
			>
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
					{items.map(pr => (
						<PullRequestCard key={pr.url} pullRequest={pr} />
					))}
				</div>
			</InfiniteScroll>
		</div>
	)
}

HomePage.getInitialProps = async ctx => {
	console.log('getInitialProps')
	const { gh_access_token: cookie } = parseCookies(ctx)
	if (cookie) {
		let query: string = defaultQuery
		if (ctx.query.query) {
			query = extractGithubQueryFromUrl(ctx.query)
		}

		const effectiveQuery = typeof query === 'string' ? query : query[0]

		const results = await getPullRequests(
			effectiveQuery,
			extractToken(cookie)
		)
		if (results) {
			return {
				initialLoad: results.pullRequests.filter(notNullOrUndefined),
				initialPageInfo: results.pageInfo,
			}
		}
	}

	await authenticate(ctx)

	return {
		initialLoad: [],
		initialPageInfo: {
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
