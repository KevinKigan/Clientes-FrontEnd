import {Component, OnInit} from '@angular/core';
import {Cliente} from '../clientes/cliente';
import {ClienteService} from '../../services/cliente.service';
import {ActivatedRoute, Router} from '@angular/router';
import swal from 'sweetalert2';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  cliente: Cliente = new Cliente();
  title: string = 'Crear Cliente';
  titleEdit: string = 'Editar Cliente';

  constructor(private clienteService: ClienteService, private router: Router, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.loadClient();
  }

  public create(): void {
    this.clienteService.create(this.cliente).subscribe(
      cliente => {
        this.router.navigate(['/clientes']); // Redirige al listado de clientes
        swal.fire('Cliente Guardado', `Cliente ${cliente.clientName} creado con éxito`, 'success'); // Muestra un popup
      }
    );
  }

  public update(): void {
    this.clienteService.update(this.cliente).subscribe(
      cliente => {
        this.router.navigate(['/clientes']); // Redirige al listado de clientes
        swal.fire('Cliente Actualizado', `Cliente ${cliente.clientName} actualizado con éxito`, 'success'); // Muestra un popup
      }
    );
  }



  public loadClient(): void {
    this.activatedRoute.params.subscribe(params => {
      let id = params['id']; // Let se usa para declaracion de variables al igual que la palabra reservada "var"
      if (id) {
        this.clienteService.getCliente(id).subscribe((cliente) => this.cliente = cliente);
      }
    });
  }


}