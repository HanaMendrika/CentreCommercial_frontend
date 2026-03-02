export interface VentesStats {
  chiffreAffaires: number;
  nbVentes: number;
  topProduits: TopProduit[];
  evolutionMensuelle: EvolutionMensuelle[];
}

export interface TopProduit {
  idProduit: string;
  quantiteVendue: number;
}

export interface EvolutionMensuelle {
  mois: string;
  montant: number;
}

export interface ProfilBoutique {
  libelle: string;
  ouverture: string;
  fermeture: string;
  url: string;
  description: string;
}