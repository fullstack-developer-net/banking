import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BaseApi {
  constructor(private http: HttpClient) {}
  baseApiUrl = environment.apiUrl + '/api/v1';
  get<T>(url: string, options?: any): Observable<T> {
    return this.http.get<T>(url, { ...options, observe: 'response' }).pipe(map((response: HttpResponse<T>) => response.body as T));
  }
  post<T>(url: string, body: any, options?: any): Observable<T> {
    return this.http.post<T>(url, body, { ...options, observe: 'response' }).pipe(map((response: HttpResponse<T>) => response.body as T));
  }

  put<T>(url: string, body: any, options?: any): Observable<T> {
    return this.http.put<T>(url, body, { ...options, observe: 'response' }).pipe(map((response: HttpResponse<T>) => response.body as T));
  }

  delete<T>(url: string, options?: any): Observable<T> {
    return this.http.delete<T>(url, { ...options, observe: 'response' }).pipe(map((response: HttpResponse<T>) => response.body as T));
  }

  patch<T>(url: string, body: any, options?: any): Observable<T> {
    return this.http.patch<T>(url, body, { ...options, observe: 'response' }).pipe(map((response: HttpResponse<T>) => response.body as T));
  }
}
