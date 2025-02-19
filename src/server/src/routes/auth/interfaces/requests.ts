interface GetRequests {
    id: number,
    url: string,
    status: 'NEW' | 'PROCESSING' | 'DONE' | 'ERROR',
    httpCode: number | null
}

interface SwitchCronBody {
    flag: boolean
}

export { GetRequests, SwitchCronBody }