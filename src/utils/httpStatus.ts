export function isSuccess(status: number): boolean {
    return status >= 200 && status < 300
}

export function isCreated(status: number): boolean {
    return status === 201
}

export function isNoContent(status: number): boolean {
    return status === 204
}
