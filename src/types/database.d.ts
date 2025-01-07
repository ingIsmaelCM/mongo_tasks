
export type Lookup ={
    from: string,
    localField?: string,
    foreignField: string,
    as: string
}

export type DBResult<T> = {
    rows: T[],
    count: number,
    currentPage: number,
    lastPage: number,
    nextPage: number|null,
    prevPage: number|null,
    pageSize: number,
    inThisPage: number,
}   