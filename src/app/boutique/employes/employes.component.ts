import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BoutiqueApiService } from '../../services/boutique-api.service';

@Component({
  selector: 'app-employes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employes.component.html',
  // styleUrls: ['./employes.component.css']
})
export class EmployesComponent implements OnInit {
  items: any[] = [];
  loading = false;
  error = '';
  showModal = false;
  isEdit = false;
  form: any = {};
  formError = '';
  saving = false;
  filterRole = '';

  constructor(private api: BoutiqueApiService) {}

  ngOnInit() { 
    this.load(); 
  }

  load() {
    this.loading = true; 
    this.error = '';
    
    const f: any = {};
    if (this.filterRole) f.role = this.filterRole;
    
    this.api.getEmployes(f).subscribe({
      next: d => { 
        this.items = Array.isArray(d) ? d : []; 
        this.loading = false; 
      },
      error: e => { 
        this.error = e.error?.message || 'Erreur'; 
        this.loading = false; 
      }
    });
  }

  openAdd() { 
    this.form = {}; 
    this.isEdit = false; 
    this.formError = ''; 
    this.showModal = true; 
  }

  openEdit(e: any) { 
    this.form = { ...e }; 
    this.isEdit = true; 
    this.formError = ''; 
    this.showModal = true; 
  }

  close() { 
    this.showModal = false; 
  }

  save() {
    if (!this.form.nom || !this.form.role || !this.form.contact) {
      this.formError = 'Nom, rôle et contact sont requis.';
      return;
    }
    
    this.saving = true; 
    this.formError = '';
    
    const obs = this.isEdit
      ? this.api.updateEmploye(this.form.idEmploye, this.form)
      : this.api.addEmploye(this.form);
    
    obs.subscribe({
      next: () => { 
        this.saving = false; 
        this.close(); 
        this.load(); 
      },
      error: e => { 
        this.formError = e.error?.message || 'Erreur'; 
        this.saving = false; 
      }
    });
  }

  delete(id: string) {
    if (!confirm('Supprimer cet employé ?')) return;
    
    this.api.deleteEmploye(id).subscribe({ 
      next: () => this.load(), 
      error: e => this.error = e.error?.message || 'Erreur' 
    });
  }
}