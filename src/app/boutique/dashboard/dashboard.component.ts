import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts'; // Changé : import du directive au lieu du module
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BoutiqueApiService } from '../../services/boutique-api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, BaseChartDirective], // Ajouté BaseChartDirective
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  stats: any = null;
  profil: any = null;
  nbProduits: number | null = null;
  nbEmployes: number | null = null;

  // Configuration pour le graphique d'évolution des ventes
  lineChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [],
        label: 'Chiffre d\'affaires',
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        borderColor: 'rgba(99, 102, 241, 1)',
        pointBackgroundColor: 'rgba(99, 102, 241, 1)',
        pointBorderColor: '#fff',
        fill: true,
        tension: 0.4
      }
    ],
    labels: []
  };

  lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        labels: {
          color: 'var(--cc-text)'
        }
      }
    },
    scales: {
      y: {
        grid: {
          color: 'var(--cc-border)'
        },
        ticks: {
          color: 'var(--cc-muted)'
        }
      },
      x: {
        grid: {
          color: 'var(--cc-border)'
        },
        ticks: {
          color: 'var(--cc-muted)'
        }
      }
    }
  };

  lineChartType: ChartType = 'line';

  // Configuration pour le graphique circulaire
  pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: [
        'rgba(253, 249, 11, 0.8)',
        'rgba(255, 136, 81, 0.8)',
        'rgba(251, 146, 60, 0.8)',
        'rgba(239, 68, 68, 0.8)',
        'rgba(168, 85, 247, 0.8)'
      ],
      borderColor: 'transparent'
    }]
  };

  pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#ffff'
        }
      }
    }
  };

  pieChartType: ChartType = 'pie';

  constructor(private api: BoutiqueApiService) {}

  ngOnInit() {
    this.api.getVentesStats().subscribe({ 
      next: d => {
        this.stats = d;
        this.prepareChartData(d);
      }, 
      error: (err) => console.error('Erreur stats:', err)
    });
    
    this.api.getProfil().subscribe({ 
      next: d => this.profil = d, 
      error: (err) => console.error('Erreur profil:', err)
    });
    
    this.api.getProduits().subscribe({ 
      next: (d: any[]) => this.nbProduits = d.length, 
      error: (err) => console.error('Erreur produits:', err)
    });
    
    this.api.getEmployes().subscribe({ 
      next: (d: any[]) => this.nbEmployes = d.length, 
      error: (err) => console.error('Erreur employés:', err)
    });
  }

  prepareChartData(stats: any) {
    // Préparer les données pour le graphique d'évolution
    if (stats.evolutionMensuelle && stats.evolutionMensuelle.length > 0) {
      this.lineChartData.labels = stats.evolutionMensuelle.map((item: any) => item.mois);
      this.lineChartData.datasets[0].data = stats.evolutionMensuelle.map((item: any) => item.montant);
    }

    // Préparer les données pour le graphique circulaire (top produits)
    if (stats.topProduits && stats.topProduits.length > 0) {
      this.pieChartData.labels = stats.topProduits.slice(0, 5).map((p: any) => `Produit ${p.idProduit}`);
      this.pieChartData.datasets[0].data = stats.topProduits.slice(0, 5).map((p: any) => p.quantiteVendue);
    }
  }
}