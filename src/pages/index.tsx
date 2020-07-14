import uniqBy from 'lodash/uniqBy'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { parseCookies } from 'nookies'
import nProgress from 'nprogress'
import { ParsedUrlQuery } from 'querystring'
import * as React from 'react'
import { useEffect, useRef, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroller'
import { useWindowSize } from 'react-use'
import { Loading } from '../components/Loading'
import { PullRequestCard } from '../components/PullRequestCard'
import { SearchBar } from '../components/SearchBar'
import { authenticate, extractToken } from '../core/authentication'
import { PageInfo, PullRequest } from '../core/pullRequest'
import { pullRequestsService } from '../core/pullRequestService'

const defaultQuery =
    'is:open org:facebook org:netflix repo:magoo-magoo/keyrier-json'

type Props = {
    initialLoad: readonly PullRequest[]
    initialPageInfo: PageInfo
}
type loadingState = 'idle' | 'pending' | 'resolved'
const getGithubQueryFromUrl = (query: ParsedUrlQuery) => {
    if (!query.query) {
        return null
    }
    return typeof query.query === 'string' ? query.query : query.query[0]
}

const HomePage: NextPage<Props> = ({ initialLoad, initialPageInfo }) => {
    const { push, query: parsedUrlQuery } = useRouter()
    const { height } = useWindowSize()
    const [canScroll, SetCanScroll] = useState(initialPageInfo.hasNextPage)
    const [items, setItems] = useState(initialLoad)
    const [lastItem, setLastItem] = useState(initialPageInfo.endCursor)
    const [loading, innerSetLoading] = useState<loadingState>('resolved')
    const isFirstRun = useRef(true)

    const githubQuery = getGithubQueryFromUrl(parsedUrlQuery) ?? defaultQuery

    const setLoading = (value: loadingState) => {
        innerSetLoading(value)
        if (value === 'pending') {
            nProgress.start()
        }
        if (value === 'resolved') {
            nProgress.done(true)
        }
    }

    const updateRouteWithQuery = (newValue: string) => {
        if (newValue === githubQuery) {
            return
        }
        push(`/?query=${newValue}`, `/?query=${newValue}`, {
            shallow: true,
        })
    }

    const getPullrequests = async () => {
        const { gh_access_token: cookie } = parseCookies()
        setLoading('pending')
        const response = await pullRequestsService.getAll(
            githubQuery,
            extractToken(cookie)
        )
        setLoading('resolved')
        setItems(response?.pullRequests ?? [])
        SetCanScroll(response?.pageInfo.hasNextPage)
        setLastItem(response?.pageInfo.endCursor)
    }

    useEffect(() => {
        // on first run data is already there, thanks to SSR
        if (isFirstRun.current) {
            isFirstRun.current = false
            return
        }

        getPullrequests()
    }, [githubQuery])

    useEffect(() => {
        if (!parsedUrlQuery.query) {
            push(`/?query=${defaultQuery}`, `/?query=${defaultQuery}`, {
                shallow: true,
            })
        }
    }, [parsedUrlQuery])

    const loadMoreItems = async () => {
        if (loading === 'pending') {
            return
        }
        const { gh_access_token: cookie } = parseCookies()

        setLoading('pending')

        const results = await pullRequestsService.getAll(
            githubQuery,
            extractToken(cookie),
            lastItem
        )

        setLoading('resolved')

        if (!results) {
            return
        }

        setItems(uniqBy([...items, ...results.pullRequests], 'url'))
        setLastItem(results.pageInfo.endCursor)
        SetCanScroll(results.pageInfo.hasNextPage)
    }

    return (
        <div className="mx-4">
            <SearchBar
                loading={loading === 'pending'}
                dispatchQuery={updateRouteWithQuery}
                query={githubQuery}
            />
            <InfiniteScroll
                className="flex flex-wrap justify-center"
                pageStart={0}
                loadMore={loading === 'pending' ? () => {} : loadMoreItems}
                hasMore={canScroll}
                initialLoad={false}
                threshold={height}
                loader={<Loading key={'loading-element'} />}
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {items.map((pr) => (
                        <PullRequestCard key={pr.url} pullRequest={pr} />
                    ))}
                </div>
            </InfiniteScroll>
        </div>
    )
}

// This gets called on every request
export async function getServerSideProps(ctx: any) {
    const { gh_access_token: cookie } = parseCookies(ctx)
    if (cookie) {
        let query: string = ctx.query.query
            ? getGithubQueryFromUrl(ctx.query) ?? defaultQuery
            : defaultQuery

        const results = await pullRequestsService.getAll(
            query,
            extractToken(cookie)
        )

        if (results) {
            return {
                props: {
                    initialLoad: results.pullRequests,
                    initialPageInfo: results.pageInfo,
                },
            }
        }
    }

    await authenticate(ctx)

    return {
        props: {
            initialLoad: [],
            initialPageInfo: {},
        },
    }
}

export default HomePage
