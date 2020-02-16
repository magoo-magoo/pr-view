import React from 'react'
import { FC } from 'react'
import refreshIcon from '../../public/refresh.svg'
import { useRouter } from 'next/router'

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

    const updateQuery = () => {
        push(`/?query=${githubQuery}`)
    }

    return (
        <div className="flex flex-wrap justify-center my-3">
            <input
                value={githubQuery}
                onChange={e => setGithubQuery(e.target.value)}
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
    )
}
