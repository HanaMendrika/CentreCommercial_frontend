import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BoutiqueApiService } from '../../services/boutique-api.service';

@Component({
  selector: 'app-commandes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './commandes.component.html',
  // styleUrls: ['./commandes.component.css']
})
export class CommandesComponent implements OnInit {
  items: any[] = [];
  loading = false;
  error = '';
  showModal = false;
  isEdit = false;
  form: any = { produits: [], idstatus: 'en attente' };
  formError = '';
  saving = false;
  filterStatus = '';
  filterClient = '';
  detailCmd: any = null;

  constructor(private api: BoutiqueApiService) {}

  ngOnInit() { 
    this.load(); 
  }

 countByStatus(s: string): number {
  if (s === 'en attente') {
    return this.items.filter(c => c.idstatus === 'STA001' || c.idstatus === 'PAYEE').length;
  }
  return this.items.filter(c => c.idstatus === s).length;
}

 statusLabel(s: string): string {
  const map: any = {
    'STA001': 'Non payé - En attente',
    'PAYEE':  'Payé - En attente',
    'confirmé': 'Confirmé',
    'livré':    'Livré',
    'annulé':   'Annulé'
  };
  return map[s] || s;
}

statusBadge(s: string) {
  const map: any = {
    'STA001':   'cc-badge-warning',
    'PAYEE':    'cc-badge-warning',  
    'confirmé': 'cc-badge-success',
    'livré':    'cc-badge-info',
    'annulé':   'cc-badge-danger'
  };
  return map[s] || 'cc-badge-neutral';
}
  load() {
    this.loading = true; 
    this.error = '';
    
    const f: any = {};
    if (this.filterStatus) f.idstatus = this.filterStatus;
    if (this.filterClient) f.idAcheteur = this.filterClient;
    
    this.api.getCommandes(f).subscribe({
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
    this.form = { 
      produits: [{ idproduit: '', quantite: 1 }], 
      idstatus: 'en attente', 
      idAcheteur: '' 
    };
    this.isEdit = false; 
    this.formError = ''; 
    this.showModal = true;
  }

  openEdit(c: any) {
    this.form = { ...c, produits: c.produits ? [...c.produits] : [] };
    this.isEdit = true; 
    this.formError = ''; 
    this.showModal = true;
  }

  close() { 
    this.showModal = false; 
  }

  addProduit() { 
    this.form.produits.push({ idproduit: '', quantite: 1 }); 
  }

  removeProduit(i: number) { 
    this.form.produits.splice(i, 1); 
  }

  viewDetail(c: any) { 
    this.detailCmd = c; 
  }

  save() {
    if (!this.form.idAcheteur || !this.form.idstatus) {
      this.formError = 'ID Client et statut sont requis.';
      return;
    }
    
    this.saving = true; 
    this.formError = '';
    
    const obs = this.isEdit
      ? this.api.updateCommande(this.form.idcommande, this.form)
      : this.api.createCommande(this.form);
    
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
    if (!confirm('Annuler cette commande ?')) return;
    
    this.api.deleteCommande(id).subscribe({ 
      next: () => this.load(), 
      error: e => this.error = e.error?.message || 'Erreur' 
    });
  }

  updateStatus(c: any, status: string) {
  // TODO: brancher sur this.api.updateStatutCommande(...) quand le backend sera prêt
  console.log('updateStatus', c.idcommande, status);
}
}