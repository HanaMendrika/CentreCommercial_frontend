import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BoutiqueApiService } from '../../services/boutique-api.service';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css']
})
export class ProfilComponent implements OnInit {
  profil: any = null;
  loading = false;
  error = '';
  editing = false;
  form: any = {};
  saving = false;
  saveError = '';
  saveOk = false;

  constructor(public api: BoutiqueApiService) {}

  ngOnInit() { 
    this.load(); 
  }

  load() {
    this.loading = true;
    this.error = '';
    this.api.getProfil().subscribe({
      next: d => { 
        this.profil = d; 
        this.loading = false; 
      },
      error: e => { 
        this.error = e.error?.message || 'Profil introuvable'; 
        this.loading = false; 
      }
    });
  }

  startEdit() {
    this.form = {
      ...this.profil,
      dateDebut: this.profil.dateDebut?.slice(0, 10),
      dateFin: this.profil.dateFin?.slice(0, 10)
    };
    this.saveError = ''; 
    this.saveOk = false; 
    this.editing = true;
  }

  cancelEdit() { 
    this.editing = false; 
  }

  save() {
    this.saving = true; 
    this.saveError = ''; 
    this.saveOk = false;
    this.api.updateProfil(this.form).subscribe({
      next: d => { 
        this.profil = d; 
        this.saving = false; 
        this.saveOk = true; 
        this.editing = false; 
      },
      error: e => { 
        this.saveError = e.error?.message || 'Erreur'; 
        this.saving = false; 
      }
    });
  }
}