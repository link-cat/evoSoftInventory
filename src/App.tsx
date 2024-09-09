import React from "react";

interface Magasin {
  id: string;
  nom: string;
  adresse: string;
}

interface Produit {
  id: string;
  nom: string;
  prix: number;
}

interface Inventaire {
  date: string;
  produitId: string;
  stock: Record<string, number>; // Record<magasinId, stock>
}

export default function MyApp() {
  const magasins: Magasin[] = [
    { id: "1", nom: "Fokou", adresse: "Carrefour Mvog-Mbi, Yaoundé" },
    { id: "2", nom: "Super U", adresse: "Avenue Kennedy, Yaoundé" },
    { id: "3", nom: "Orca Deco", adresse: "Warda, Yaoundé" },
    { id: "4", nom: "Santa Lucia", adresse: "Marché Mokolo, Yaoundé" },
    { id: "5", nom: "Mahima", adresse: "Quartier Central, Yaoundé" },
  ];

  const produits: Produit[] = [
    { id: "1", nom: "Ciment 50kg", prix: 4500 },
    { id: "2", nom: "Fer à béton 12mm", prix: 3000 },
    { id: "3", nom: "Tôle ondulée", prix: 6000 },
    { id: "4", nom: "Riz parfumé 5kg", prix: 4500 },
    { id: "5", nom: "Lait en poudre 400g", prix: 2500 },
    { id: "6", nom: "Eau minérale 1,5L", prix: 500 },
    { id: "7", nom: "Table basse en bois", prix: 35000 },
    { id: "8", nom: "Canapé 3 places", prix: 150000 },
    { id: "9", nom: "Lampe de chevet", prix: 15000 },
    { id: "10", nom: "Haricots rouges 2kg", prix: 2500 },
    { id: "11", nom: "Poulet entier", prix: 5000 },
    { id: "12", nom: "Tomates en conserve 800g", prix: 1200 },
    { id: "13", nom: "T-shirt coton", prix: 3500 },
    { id: "14", nom: "Chaussures de sport", prix: 15000 },
    { id: "15", nom: "Parfum 50ml", prix: 10000 },
  ];

  return (
    <div>
      <h1>Gestion des Inventaires</h1>
    </div>
  );
}
