import * as React from 'react'
import { format } from 'timeago.js'
import { PullRequest } from '../services/pullRequest'
import fileIcon from '../../public/file.svg'
import commentIcon from '../../public/comment.svg'
import viewIcon from '../../public/view.svg'

type Props = {
	pullRequest: PullRequest
}
export const PullRequestCard: React.FC<Props> = ({ pullRequest }) => {
	const borderColor = pullRequest.mergeable === 'MERGEABLE' ? '' : 'border border-red'
	const opacity = pullRequest.state === 'OPEN' ? 'opacity-100' : 'opacity-25'
	const reviewers = new Set(
		pullRequest.reviews.nodes
			.filter(x => x.author.login !== pullRequest.author.login)
			.map(x => x.author.login)
	)
	return (
		<div className={`${opacity} max-w-sm w-full lg:max-w-full lg:flex`}>
			<div
				className={`w-full shadow-2xl ${borderColor}-400 bg-white rounded p-4 flex flex-col justify-between leading-normal`}
			>
				<div className="mb-4">
					<div className="text-gray-900 font-bold text-xl mb-1">
						<a href={pullRequest.url}>{pullRequest.title}</a>
					</div>
					<div className="text-gray-600 text-l mb-2">
						<a href={pullRequest.repository.url}>
							{pullRequest.repository.owner.login}/
							{pullRequest.repository.name}
						</a>
					</div>
				</div>
				<div className="flex items-center mb-4">
					<a href={pullRequest.author.url}>
						<img
							className="w-10 h-10 rounded-full mr-4"
							src={pullRequest.author?.avatarUrl}
							alt={`Avatar of ${pullRequest.author.login}`}
						/>
					</a>

					<div className="text-sm">
						<a href={pullRequest.author.url}>
							<p className="text-gray-900 leading-none">
								{pullRequest.author?.login}
							</p>
						</a>
						<p className="text-gray-600">
							{format(pullRequest.createdAt, 'en', {})}
						</p>
					</div>
				</div>
				<div className="flex justify-between gap-1 p-2">
					<div>
						<div className="flex">
							<img
								className="w-5 h-5 rounded-full mr-1"
								src={fileIcon}
							/>
							<p className="text-gray-900 leading-none">
								{pullRequest.changedFiles}
							</p>
						</div>
						<div className="flex">
							<img
								className="w-5 h-5 rounded-full mr-1"
								src={commentIcon}
							/>
							<p className="text-gray-900 leading-none">
								{pullRequest.comments.totalCount +
									pullRequest.reviews.nodes.reduce(
										(acc, r) =>
											acc + r.comments?.totalCount,
										0
									)}
							</p>
						</div>
					</div>
					<div className="flex">
						<img
							className="w-5 h-5 rounded-full mr-1"
							src={viewIcon}
						/>
						<p className="text-gray-900 leading-none">
							{reviewers.size}
						</p>
					</div>
				</div>
			</div>
		</div>
	)
}
