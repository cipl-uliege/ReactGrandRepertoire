export class Pagination{
    public static readonly nbrOfDisplayedPages = 5;
    public static readonly defaultPage = 1;
    public static readonly defaultResultPerPage = 25;
    public static readonly selectableResults = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50]

    public static get(resultsPerPage:number, nbrOfResults:number, currentPage:number){
        let nbrOfPagesMax = Math.ceil(nbrOfResults / resultsPerPage);
        let nbrOfDisplayedPages = this.nbrOfDisplayedPages;
        let pages:number[] = [];

        let pageNumber = 0;

        if(currentPage - Math.floor(nbrOfDisplayedPages / 2) <= 0){
            pageNumber = 1;
            for(let i = 0; i < nbrOfDisplayedPages; i++){
                if(pageNumber <= nbrOfPagesMax){
                    pages[i] = pageNumber;
                }else{
                    pages[i] = 0;
                }
                pageNumber++;
            }
        }
        else if(currentPage + Math.floor(nbrOfDisplayedPages / 2) > nbrOfPagesMax){
            if(currentPage < nbrOfDisplayedPages){
                pageNumber = 1;
            }else{
                pageNumber = nbrOfPagesMax - (nbrOfDisplayedPages-1);
            }

            for(let i = 0; i < nbrOfDisplayedPages; i++){
                if(pageNumber <= nbrOfPagesMax){
                    pages[i] = pageNumber;
                }else{
                    pages[i] = 0;
                }
                pageNumber++;
            }
        }
        else{
            pageNumber = (currentPage - Math.floor(nbrOfDisplayedPages / 2));
            for(let i = 0; i < nbrOfDisplayedPages; i++){
                pages[i] = pageNumber;
                pageNumber++;
            }
        }

        return pages.filter(p => p != 0);
    }
}