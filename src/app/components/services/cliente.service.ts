import { Injectable } from '@angular/core';
import {Cliente} from '../pages/clientes/cliente';
import {Observable, throwError} from 'rxjs';
import {HttpClient, HttpEvent, HttpHeaders, HttpRequest} from '@angular/common/http';
import {urlEndPoint} from '../../../environments/environment';
import {catchError, map} from 'rxjs/operators';
import swal from 'sweetalert2';
import {Router} from '@angular/router';
import {formatDate} from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private httpHeaders = new HttpHeaders({'Content-type':'application/json'});

  constructor(private http: HttpClient, private router: Router) { }

  /**
   * Metodo para obtener todos los clientes
   */
  getClientes(page: number): Observable<any>{ // Observable hace que el metodo sea asincrono
    // return of(CLIENTES);                // Convierte el listado clientes en un observable y por consiguiente en un stream
    return this.http.get<Cliente[]>(urlEndPoint+'/page/'+page).pipe( // Hace una peticion get a la url para retornar un json que transforma en una lista de clientes
      map((response: any) =>{

         (response.content as Cliente[]).map(cliente => {
            cliente.clientName = cliente.clientName.toUpperCase();  // Ponemos todos los nombres de los clientes en mayuscula
            cliente.lastName = cliente.lastName.toUpperCase();
            cliente.createAt = formatDate(cliente.createAt, 'dd/MM/yyyy','en-US');
            return cliente;
          }
        );
         return response;
      }));
  }

  /**
   * Metodo para crear un nuevo cliente
   *
   * @param cliente Cliente a crear
   */
  create(cliente: Cliente):Observable<any>{
    return this.http.post<any>(urlEndPoint, cliente, {headers: this.httpHeaders}).pipe(
      catchError(e => {
        if(e.status==400){ // Error de formulario
          return throwError(e);
        }
        console.error(e.error.mensaje);
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }

  /**
   * Metodo para obtener un solo cliente
   *
   * @param id ID del cliente a obtener
   */
  getCliente(id): Observable<any>{
    return this.http.get<Cliente>(`${urlEndPoint}/${id}`).pipe(
      catchError(e => {
        this.router.navigate(['/clientes']);
        console.error(e.error.mensaje);
        swal.fire('Error al obtener cliente', e.error.mensaje, 'error');
        return throwError(e);
      })
    );
  }


  /**
   * Metodo para actualizar un cliente ya existente
   *
   * @param cliente Cliente a actualizar
   */
  update(cliente: Cliente): Observable<any>{
    return this.http.put<any>(`${urlEndPoint}/${cliente.id}`, cliente, {headers: this.httpHeaders}).pipe(
      catchError(e => {
        if(e.status==400){ // Error de formulario
          return throwError(e);
        }
        console.error(e.error.mensaje);
        swal.fire('Error al editar el cliente', e.error.mensaje, 'error');
        return throwError(e);
      })
    );
  }// Intercepta el observable en busca de fallos

  /**
   * Metodo para borrar un cliente
   *
   * @param id ID del cliente a borrar
   */
  delete(id: number): Observable<Cliente>{
    return this.http.delete<Cliente>(`${urlEndPoint}/${id}`,{headers: this.httpHeaders}).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        swal.fire('Error al eliminar cliente', e.error.mensaje, 'error');
        return throwError(e);
      })
    );
  }

  /**
   * Metodo para subir la foto de perfil de un cliente
   *
   * @param file
   * @param id
   */
  public uploadPhoto(file: File, id): Observable<HttpEvent<{}>>{
    let formData = new FormData();
    formData.append("file", file);
    formData.append("id", id);
    const req = new HttpRequest('POST', `${urlEndPoint}/upload`, formData, {
      reportProgress: true
    });
    console.log(req);
    return this.http.request(req)
    //   .pipe(
    //   map((response: any) => response.cliente as Cliente),
    // catchError(e => {
    //   console.error(e.error.error);
    //   swal.fire('Error subir imagen del cliente', e.error.error, 'error');
    //   return throwError(e);
    // })
    //)
      ;
  }
}
