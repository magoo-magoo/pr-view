export function notNullOrUndefined<T>(x: T | undefined | null): x is T {
    return x !== null && x !== undefined
}

export const isClientSide = () => typeof window !== 'undefined'
export const isServerSide = () => !isClientSide()
