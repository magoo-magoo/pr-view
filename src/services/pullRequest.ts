export interface Welcome {
	data: Data
}

export interface Data {
	search: Search
}

export interface Search {
	edges: Edge[]
}

export interface Edge {
	node: PullRequest
}

export interface PullRequest {
	url: string
	author: Author
	title: string
	createdAt: Date
	activeLockReason: null
	locked: boolean
	mergeable: Mergeable
	changedFiles: number
	comments: Comments
	reviews: Reviews
	repository: Repository
	state: 'CLOSED' | 'OPEN' | 'MERGED'
}

export interface Author {
	login: string
	url: string
	avatarUrl: string
}

export interface Comments {
	totalCount: number
}

export enum Mergeable {
	Conflicting = 'CONFLICTING',
	Mergeable = 'MERGEABLE',
	Unknown = 'UNKNOWN',
}

export interface Repository {
	name: string
	url: string
	owner: Author
}

export interface Reviews {
	nodes: NodeElement[]
}

export interface NodeElement {
	comments: Comments
	author: Author
}
