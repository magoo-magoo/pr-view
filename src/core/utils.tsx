export function notNullOrUndefined<T>(x: T | undefined | null): x is T {
    return !!x;
}
