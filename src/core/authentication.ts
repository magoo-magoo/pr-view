import { NextPageContext } from 'next'

import { setCookie } from 'nookies'
import { stringify } from 'querystring'
import isoFetch from 'isomorphic-unfetch'

export type TokenResponse = {
	access_token: string
	scope: string
	token_type: string
}

export const extractToken = (cookie: string) =>
	(JSON.parse(cookie) as TokenResponse).access_token

export const authenticate = async (ctx: NextPageContext) => {
	const githubAuthorizeBaseUrl = process.env.PR_VIEW_GITHUB_AUTHORIZE_BASE_URL
	const client_id = process.env.PR_VIEW_CLIENT_ID
	const clientSecret = process.env.PR_VIEW_CLIENT_SECRET
	const redirectUrl = process.env.PR_VIEW_REDIRECT_URL
	const scope = process.env.PR_VIEW_SCOPE
	if (ctx.query.code) {
		// authenticated
		const tokenResponse: TokenResponse = await (
			await isoFetch(
				`${githubAuthorizeBaseUrl}/access_token?client_id=${client_id}&client_secret=${clientSecret}&code=${ctx.query.code}`,
				{
					method: 'POST',
					headers: [['accept', 'application/json']],
				}
			)
		).json()

		setCookie(ctx, 'gh_access_token', JSON.stringify(tokenResponse), {
			maxAge: 30 * 24 * 60 * 60,
			path: '/',
		})
		const cleansedQuery = Object.assign({}, ctx.query)
		delete cleansedQuery.code
		ctx.res?.writeHead(307, {
			Location: `/?${stringify(cleansedQuery)}`,
		})
		ctx.res?.end()
	} else {
		// unauthenticated
		const autorizeUrl = `${githubAuthorizeBaseUrl}/authorize?client_id=${client_id}&scope=${scope}&redirect_uri=${`${redirectUrl}${ctx.asPath}`}`
		if (!ctx.req) {
			location.href = autorizeUrl
		} else {
			ctx.res?.writeHead(307, { Location: autorizeUrl })
			ctx.res?.end()
		}
	}
}
