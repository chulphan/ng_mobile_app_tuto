import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse
} from "@angular/common/http";

import { throwError } from "rxjs";
import { map, catchError } from "rxjs/operators";

import { Config } from "../config";
import { Grocery } from "./grocery";

@Injectable()
export class GroceryService {
  private baseUrl = `${Config.apiUrl}appdata/${Config.appKey}/groceries`;

  constructor(private http: HttpClient) {}

  public load() {
    return this.http
      .get(this.baseUrl, {
        headers: this.getCommonHeaders()
      })
      .pipe(
        map((data: any[]) => {
          const groceryList = data
            .sort((a, b) => {
              return a._kmd.lmt > b._kmd.lmt ? 1 : -1;
            })
            .map(
              grocery => new Grocery(grocery._id, grocery.Name || grocery.name)
            );
          return groceryList;
        }),
        catchError(this.handleErrors)
      );
  }

  public add(grocery: string) {
    return this.http
      .post(this.baseUrl, JSON.stringify({ name: grocery }), {
        headers: this.getCommonHeaders()
      })
      .pipe(
        map((data: any) => {
          return new Grocery(data._id, grocery);
        }),
        catchError(this.handleErrors)
      );
  }

  private getCommonHeaders() {
    return new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: `Kinvey ${Config.token}`
    });
  }

  private handleErrors(error: HttpErrorResponse) {
    console.log(error);
    return throwError(error);
  }
}
