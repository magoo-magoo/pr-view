import { graphql } from '@octokit/graphql'
import { Search, PullRequest } from './pullRequest'
import { notNullOrUndefined } from './utils'

const githubApiBaseUrl = 'https://api.github.com' // process.env.PR_VIEW_GITHUB_BASE_URL //
const url = '/graphql' // process.env.PR_VIEW_GITHUB_GRAPHQL_URL //
const graphqlApi = graphql.defaults({
    baseUrl: githubApiBaseUrl,
    url: url,
})

const queries: any = {}

export const pullRequestsService = {
    getAll: async (
        query: string,
        token: string,
        after: string | null = null
    ) => {


		// prevent to perform twice the same query on browser side
		if (typeof window !== 'undefined') {
			const queryKey = `${query}-${token}-${after}`
            if (queries[queryKey]) {
                return {
                    pullRequests: [] as PullRequest[],
                    pageInfo: {},
                    status: 'ALREADY_RUNNING',
                } as const
            }
            queries[queryKey] = 1
        }

        try {
            console.log(`getAll ${query} ${after} , ${token}`)
            const results: {
                search?: Search
            } | null = await graphqlApi(
                `
			  { 
				search(query: "${query} is:pr", type: ISSUE, after:${
                    after ? '"' + after + '"' : 'null'
                }, first: 25) {
				pageInfo {
					hasNextPage
					hasPreviousPage
					endCursor
					startCursor
				}
				  edges {
					node {
					  ... on PullRequest {
						url
						author { 
						  login
						  url
						  avatarUrl
						}
						title
						createdAt
						mergeable
						changedFiles
						state
						comments {
						  totalCount
						}
						reviews(last: 100) {
						  nodes {
							comments {
							  totalCount
							}
							author {
							  avatarUrl
							  login
							  url
							}
						  }
						}
						repository {
						  name
						  url
						  owner {
							login
							url
							avatarUrl
						  }
						}
					  }
					}
				  }
				}
			  }
			  
			  `,
                {
                    headers: {
                        authorization: `token ${token}`,
                    },
                }
            )

            const pullRequests =
                results?.search?.edges
                    ?.map(x => x.node)
                    .filter(notNullOrUndefined) ?? []
            const pageInfo = results?.search?.pageInfo ?? {}
            return { pullRequests, pageInfo, status: 'FINISHED' } as const
        } catch (error) {
            console.error(JSON.stringify(error))
            if (error.status === 401) {
                return null
            }
        }
        return {
            pullRequests: [] as PullRequest[],
            pageInfo: {
                hasNextPage: false,
                hasPreviousPage: false,
                endCursor: '',
                startCursor: '',
            },
            status: 'ERRORED',
        } as const
    },
}
