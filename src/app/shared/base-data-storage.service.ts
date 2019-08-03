import { Observable, throwError, zip } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface DataStorageItem {
  id: string;
}

type ItemFactory<T> = (fields: Pick<T, keyof T>) => T;

interface DataStorageCollection<T extends DataStorageItem> {
  [id: string]: T;
}

export class BaseDataStorageService<T extends DataStorageItem> {

  constructor(
    private readonly http: HttpClient,
    private readonly collectionName: string,
    private readonly itemFactory: ItemFactory<T>
  ) {
  }

  private static handleErrorResponse<T>(errRes: HttpErrorResponse): Observable<T> {
    let errorMessage = '';
    switch (errRes.status) {
      case 401:
        errorMessage = 'Not Authorized.';
        break;
      case 404:
        errorMessage = 'Database was not found';
        break;
      case 500:
        errorMessage = 'Internal Server Error';
        break;
      case 503:
        errorMessage = 'Service Unavailable';
        break;
      default:
        console.log(errRes);
        errorMessage = 'Unknown error occurs during update recipe';
        break;
    }

    return throwError(new Error(errorMessage));
  }

  updateAll(...items: (T | Partial<T> & { id: string })[]): Observable<void> {
    const observables: Observable<void>[] = [];
    for (const item of items) {
      observables.push(this.update(item));
    }
    return zip(...observables)
      .pipe(
        map(() => {
        })
      );
  }

  update(item: T | Partial<T> & { id: string }): Observable<void> {
    return this.http.patch(this.getItemUrl(item.id), item)
      .pipe(
        map(() => {
        }),
        catchError(errRes => BaseDataStorageService.handleErrorResponse<void>(errRes))
      );
  }

  put(items: T[]): Observable<void> {
    const data: DataStorageCollection<T> = items.reduce<DataStorageCollection<T>>((acc, item) => {
      acc[item.id] = item;
      return acc;
    }, {});
    return this.http.put(this.getUrl(), data)
      .pipe(
        map(() => {
        }),
        catchError(() => throwError(new Error('Cannot store data')))
      );
  }


  get(): Observable<T[]> {
    return this.http.get<DataStorageCollection<T>>(this.getUrl())
      .pipe(
        map((data: DataStorageCollection<T>) => {
          const items: T[] = [];
          if (data) {
            for (const id of Object.keys(data)) {
              const itemData = data[id];
              const item = this.itemFactory(itemData);
              items.push(item);
            }
          }
          return items;
        }),
        catchError((errRes) => BaseDataStorageService.handleErrorResponse<T[]>(errRes))
      );
  }

  delete(itemId: string): Observable<void> {
    return this.http.delete(this.getItemUrl(itemId))
      .pipe(
        map(() => {
        }),
        catchError(errRes => BaseDataStorageService.handleErrorResponse<void>(errRes))
      );
  }

  private getItemUrl(itemId: string): string {
    return `${environment.firebase.endpoint}/${this.collectionName}/${itemId}.json`;
  }

  private getUrl(): string {
    return `${environment.firebase.endpoint}/${this.collectionName}.json`;
  }
}
