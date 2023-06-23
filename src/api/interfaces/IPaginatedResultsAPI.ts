export interface IPaginatedResultsAPI<T>{
    totalNbrOfResults:number,
    page:number,
    resultsPerPage:number,
    maxNbrOfPages:number,
    results:T
}