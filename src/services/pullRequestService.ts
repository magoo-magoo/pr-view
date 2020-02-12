import { graphql } from '@octokit/graphql'
import { Edge } from './pullRequest'

const graphqlApi = graphql.defaults({
	baseUrl: 'https://api.github.com',
	url: '/graphql',
})

export const pullRequestsService = {
	getAll: async (query: string, token: string) => {
		try {
			const results: {
				search?: { edges?: Edge[] }
			} | null = await graphqlApi(
				`
			  {
				search(query: "${query} is:pr", type: ISSUE, last: 25) {
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
						activeLockReason
						locked
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

			return results?.search?.edges?.map(x => x.node) ?? []
		} catch (error) {
			if (error.status === 401) {
				return null
			}
		}
		return []
	},
}
