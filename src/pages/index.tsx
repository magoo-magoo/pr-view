import * as React from 'react'
import { NextPage } from 'next'
import { pullRequestsService } from '../core/pullRequestService'
import { PullRequestCard } from '../components/PullRequestCard'
import { useRouter } from 'next/router'
import { PullRequest, PageInfo } from '../core/pullRequest'
import { parseCookies } from 'nookies'
import InfiniteScroll from 'react-infinite-scroller'
import { authenticate, extractToken } from '../core/authentication'
import { useWindowSize } from 'react-use'
import { useState, useEffect } from 'react'
import { notNullOrUndefined } from '../core/utils'
import { Loading } from '../components/Loading'
import { ParsedUrlQuery } from 'querystring'
import { SearchBar } from '../components/SearchBar'
import uniqBy from 'lodash/uniqBy'

const defaultQuery = 'is:open org:facebook org:netflix repo:magoo-magoo/keyrier-json'

type Props = {
    initialLoad: readonly PullRequest[]
    initialPageInfo: PageInfo
}

const getGithubQueryFromUrl = (query: ParsedUrlQuery) => {
    if (!query.query) {
        return ''
    }
    return typeof query.query === 'string' ? query.query : query.query[0]
}

const HomePage: NextPage<Props> = ({ initialLoad, initialPageInfo }) => {
    const { push, query: parsedUrlQuery, events } = useRouter()
    const { height } = useWindowSize()

    const [githubQuery, setGithubQuery] = useState(
        getGithubQueryFromUrl(parsedUrlQuery)
    )
    const [canScroll, SetCanScroll] = useState(initialPageInfo.hasNextPage)
    const [items, setItems] = useState(initialLoad)
    const [lastItem, setLastItem] = useState(initialPageInfo.endCursor)
    const [loading, setLoading] = useState(true)

    events?.on('routeChangeStart', () => setLoading(true))

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
        setGithubQuery(getGithubQueryFromUrl(parsedUrlQuery))
        setLastItem(initialPageInfo.endCursor)
        SetCanScroll(initialPageInfo.hasNextPage)
    }, [initialLoad, initialPageInfo])

    useEffect(() => {
        setLoading(false)
    }, [items])

    const loadMoreItems = async () => {
        const { gh_access_token: cookie } = parseCookies()

        const results = await pullRequestsService.getAll(
            githubQuery,
            extractToken(cookie),
            lastItem
        )

        setLoading(false)

        if (!results) {
            return
        }
        console.log(results.status)

        if (results.status === 'ALREADY_RUNNING') {
            return
        }

        setItems(uniqBy([...items, ...results.pullRequests], 'url'))
        setLastItem(results.pageInfo.endCursor)
        SetCanScroll(results.pageInfo.hasNextPage)
    }

    return (
        <div className="mx-4">
            <SearchBar
                loading={loading}
                githubQuery={githubQuery}
                setGithubQuery={setGithubQuery}
            />
            <InfiniteScroll
                className="flex flex-wrap justify-center"
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
    console.log({cookie})
    if (cookie) {
        let query: string = ctx.query.query
            ? getGithubQueryFromUrl(ctx.query)
            : defaultQuery

        const results = await pullRequestsService.getAll(
            query,
            extractToken(cookie)
        )
        console.log({ pageInfo: results?.pageInfo, status: results?.status})
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
        initialPageInfo: {},
    }
}

export default HomePage
