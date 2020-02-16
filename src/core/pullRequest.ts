export interface Data {
    search?: Search
}

export interface Search {
    edges?: Edge[]
    pageInfo?: PageInfo
}

export type PageInfo = {
    hasNextPage?: boolean
    // hasPreviousPage: boolean
    endCursor?: string
    // startCursor: string
}

export type Edge = {
    node?: PullRequest
}

export type PullRequest = {
    url?: string
    author?: Author
    title?: string
    createdAt?: Date
    mergeable?: Mergeable
    changedFiles?: number
    comments?: Comments
    reviews?: Reviews
    repository?: Repository
    state?: 'CLOSED' | 'OPEN' | 'MERGED'
}

export type Author = {
    login?: string
    url?: string
    avatarUrl?: string
}

export type Comments = {
    totalCount?: number
}

export enum Mergeable {
    Conflicting = 'CONFLICTING',
    Mergeable = 'MERGEABLE',
    Unknown = 'UNKNOWN',
}

export type Repository = {
    name?: string
    url?: string
    owner?: Author
}

export type Reviews = {
    nodes?: NodeElement[]
}

export type NodeElement = {
    comments?: Comments
    author?: Author
}
