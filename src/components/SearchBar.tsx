import React, { useState } from 'react'
import { FC } from 'react'
import { useRouter } from 'next/router'

export type GithubQuery = {
    is: string[]
    org: string[]
    repo: string[]
}
const parseGithubQuery = (stringQuery: string) => {
    const queryObject: GithubQuery = {
        is: [],
        org: [],
        repo: [],
    }
    const tokens = stringQuery.split(' ').map(x => x.trim().toLowerCase())

    tokens.forEach(x => {
        if (x.startsWith('is:') && x.length > 3) {
            queryObject.is.push(x.substring(3).trim())
        } else if (x.startsWith('org:') && x.length > 4) {
            queryObject.org.push(x.substring(4).trim())
        } else if (x.startsWith('repo:') && x.length > 5) {
            queryObject.repo.push(x.substring(5).trim())
        }
    })

    return queryObject
}

type Props = {
    githubQuery: string
    setGithubQuery: (v: string) => void
    loading: boolean
}
export const SearchBar: FC<Props> = ({
    loading,
    githubQuery,
    setGithubQuery,
}) => {
    const { push } = useRouter()
    const [filterVisible, SetFilterVisible] = useState(false)

    const queryObject = parseGithubQuery(githubQuery)

    const updateQuery = () => {
        push(`/?query=${githubQuery}`)
    }

    return (
        <div className="my-3">
            <div className="flex flex-wrap justify-center">
                <button
                    className="text-blue-900 mr-2 border-blue-700 hover:border-blue-500"
                    onClick={() => SetFilterVisible(!filterVisible)}
                >
                    <svg
                        width="24"
                        height="24"
                        className="fill-current"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                    >
                        <path d="M12 12l8-8V0H0v4l8 8v8l4-4v-4z" />
                    </svg>
                </button>
                <input
                    value={githubQuery}
                    onChange={e => {
                        if (e.target.value === '') {
                            setGithubQuery(' ')
                        } else {
                            setGithubQuery(e.target.value)
                        }
                    }}
                    onKeyPress={event => {
                        if (event.key === 'Enter') {
                            updateQuery()
                        }
                    }}
                    className="lg:w-1/3 bg-blue-100 shadow focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 block appearance-none leading-normal mr-2"
                />
                <button
                    onClick={updateQuery}
                    className="bg-blue-500 w-24 flex justify-center hover:bg-blue-400 text-blue-900 font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
                >
                    {loading ? (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            width="24"
                            height="24"
                            className="spinner fill-current"
                        >
                            <path d="M6 18.7V21a1 1 0 0 1-2 0v-5a1 1 0 0 1 1-1h5a1 1 0 1 1 0 2H7.1A7 7 0 0 0 19 12a1 1 0 1 1 2 0 9 9 0 0 1-15 6.7zM18 5.3V3a1 1 0 0 1 2 0v5a1 1 0 0 1-1 1h-5a1 1 0 0 1 0-2h2.9A7 7 0 0 0 5 12a1 1 0 1 1-2 0 9 9 0 0 1 15-6.7z" />
                        </svg>
                    ) : (
                        'Update'
                    )}
                </button>
            </div>
            <div
                className={`${
                    filterVisible ? '' : 'hidden'
                } flex flex-wrap mt-2`}
            >
                <div
                    className={`${
                        queryObject.is.length ? '' : 'hidden'
                    } ml-3 flex flex-wrap items-center`}
                >
                    <span className="mr-1">State: </span>
                    {queryObject.is.map((x, i) => (
                        <span
                            key={i}
                            className="text-sm font-medium bg-blue-200 py-1 px-2 rounded text-blue-900 align-middle mr-1"
                        >
                            {x}
                        </span>
                    ))}
                </div>

                <div
                    className={`${
                        queryObject.org.length ? '' : 'hidden'
                    } ml-3 flex flex-wrap items-center`}
                >
                    <span className="mr-1">Organisation: </span>
                    {queryObject.org.map((x, i) => (
                        <span
                            key={i}
                            className="text-sm font-medium bg-blue-200 py-1 px-2 rounded text-blue-900 align-middle mr-1"
                        >
                            {x}
                        </span>
                    ))}
                </div>

                <div
                    className={`${
                        queryObject.repo.length ? '' : 'hidden'
                    } ml-3 flex flex-wrap items-center`}
                >
                    <span className="mr-1">Repository: </span>
                    {queryObject.repo.map((x, i) => (
                        <span
                            key={i}
                            className="text-sm font-medium bg-blue-200 py-1 px-2 rounded text-blue-900 align-middle mr-1"
                        >
                            {x}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    )
}
