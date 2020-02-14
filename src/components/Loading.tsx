import React from 'react'
import { PullRequest, Mergeable } from '../core/pullRequest'
import { PullRequestCard } from './PullRequestCard'

export const Loading = () => {
	const emptyPr = {}

	return (
		<>
			<div className="flex flex-wrap justify-center">Loading...</div>
		</>
	)
}
