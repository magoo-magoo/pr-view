import * as React from 'react'
import { format } from 'timeago.js'
import { PullRequest } from '../core/pullRequest'
import fileIcon from '../../public/file.svg'
import commentIcon from '../../public/comment.svg'
import viewIcon from '../../public/view.svg'
import uniqBy from 'lodash/uniqBy'
import LazyLoad from 'react-lazyload'

type Props = {
    pullRequest: PullRequest
}
export const PullRequestCard: React.FC<Props> = ({ pullRequest }) => {
    const borderColor =
        pullRequest.mergeable === 'MERGEABLE' ? '' : 'border border-red'
    const opacity = pullRequest.state === 'OPEN' ? 'opacity-100' : 'opacity-25'
    const reviewers = uniqBy(
        pullRequest.reviews?.nodes
            ?.map(x => x.author)
            .filter(x => x?.login !== pullRequest.author?.login),
        'login'
    )
    return (
        <div className="flex justify-center">
            <div
                className={`${opacity} max-w-sm w-full lg:max-w-full lg:flex group hover:shadow-2xl`}
            >
                <div
                    className={`w-full shadow-xl ${borderColor}-400 bg-blue-100 rounded-lg p-4 flex flex-col justify-between leading-normal`}
                >
                    <div className="mb-4">
                        <a href={pullRequest.url}>
                            <div className="break-words text-gray-900 font-bold text-xl mb-1">
                                {pullRequest.title}
                            </div>
                        </a>
                        <div className="text-gray-600 text-l mb-2">
                            <a href={pullRequest.repository?.url}>
                                {pullRequest.repository?.owner?.login}/
                                {pullRequest.repository?.name}
                            </a>
                        </div>
                    </div>

                    <a href={pullRequest.author?.url}>
                        <div className="flex items-center mb-4">
                            <LazyLoad height={10} once={true}>
                                <img
                                    className="w-10 h-10 rounded-full mr-4"
                                    src={`${pullRequest.author?.avatarUrl}&s=48`}
                                    alt={`Avatar of ${pullRequest.author?.login}`}
                                />
                            </LazyLoad>
                            <div className="text-sm">
                                <p className="text-gray-900 leading-none">
                                    {pullRequest.author?.login}
                                </p>
                                <p className="text-gray-600">
                                    {pullRequest.createdAt &&
                                        format(pullRequest.createdAt, 'en', {})}
                                </p>
                            </div>
                        </div>
                    </a>

                    <div className="flex justify-between p-2">
                        <div className="flex gap-1">
                            <div className="flex mr-1">
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
                                    {(pullRequest?.comments?.totalCount ?? 0) +
                                        (pullRequest.reviews?.nodes?.reduce(
                                            (acc, r) =>
                                                acc +
                                                (r.comments?.totalCount ?? 0),
                                            0
                                        ) ?? 0)}
                                </p>
                            </div>
                        </div>

                        <div
                            className={`${
                                reviewers.length === 0 ? 'hidden' : ''
                            } flex flex-col`}
                        >
                            <div className="flex">
                                <img
                                    className="w-8 h-8 rounded-full mr-1"
                                    src={viewIcon}
                                />
                                {reviewers.map((x, i) => (
                                    <LazyLoad key={i} height={10} once={true}>
                                        <img
                                            className="lazyload w-8 h-8 rounded-full"
                                            src={`${x?.avatarUrl}&s=48`}
                                            alt={`Avatar of ${x?.login}`}
                                        />
                                    </LazyLoad>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
