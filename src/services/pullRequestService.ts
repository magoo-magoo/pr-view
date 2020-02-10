import { graphql } from '@octokit/graphql'
import getConfig from 'next/config'
import { Edge } from './pullRequest'

// Only holds serverRuntimeConfig and publicRuntimeConfig
const { serverRuntimeConfig, publicRuntimeConfig } = getConfig()
// Will only be available on the server-side
console.log(serverRuntimeConfig)
// Will be available on both server-side and client-side
console.log(publicRuntimeConfig)


const graphqlApi = graphql.defaults({
	baseUrl: 'https://api.github.com',
	url: '/graphql',
	headers: {
		authorization: `token ${process.env.PR_VIEW_GITHUB_COM_TOKEN}`,
	},
})

export const pullRequestsService = {
	getAll: async (query: string) => {
		const results: {
			search?: { edges?: Edge[] }
		} | null = await graphqlApi(`

		  {
			search(query: "${query} is:pr is:open", type: ISSUE, last: 100) {
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
		  
		  `)

		return results?.search?.edges?.map(x => x.node) ?? []
	},
}
