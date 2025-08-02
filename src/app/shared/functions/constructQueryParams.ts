import { HttpParams } from "@angular/common/http";

export function constructQueryParams(obj:any): HttpParams{
    let queryParams = new HttpParams();
    for(let prop in obj){
        if(obj.hasOwnProperty(prop)){
            queryParams = queryParams.append(prop,obj[prop]);
        }
    }
    return queryParams;
}