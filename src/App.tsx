import React, { useState } from "react";

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

interface InventoryTableProps {
  inventaires: Inventaire[];
  magasins: Magasin[];
  produits: Produit[];
}
interface InventoryRowProps {
  inventaire: Inventaire;
  magasins: Magasin[];
  produits: Produit[];
}

function InventoryRow({ inventaire, magasins, produits }) {
  const product = produits.find((p:Produit) => p.id === inventaire.produitId);

  return (
    <tr className="inventory-row">
      <td>{inventaire.date}</td>
      <td>{product ? product.nom : "Unknown Product"}</td>
      <td>{product ? product.prix : "NaN"} XAF</td>
      {magasins.map((magasin:Magasin) => (
        <td key={magasin.id}>
          {inventaire.stock[magasin.id] !== null
            ? inventaire.stock[magasin.id]
            : "N/A"}
        </td>
      ))}
    </tr>
  );
}

function InventoryTable({ inventaires, magasins, produits }) {
  return (
    <table className="inventory-table">
      <thead>
        <tr>
          <th rowSpan={2}>Date</th>
          <th rowSpan={2}>Produit</th>
          <th rowSpan={2}>Prix</th>
          <th colSpan={magasins.length} className="magasins-header">
            Magasins
          </th>
        </tr>
        <tr>
          {magasins.map((magasin:Magasin) => (
            <th key={magasin.id}>{magasin.nom}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {inventaires.map((inventaire:Inventaire) => (
          <InventoryRow
            key={inventaire.produitId}
            inventaire={inventaire}
            magasins={magasins}
            produits={produits}
          />
        ))}
      </tbody>
    </table>
  );
}

function InventoryForm({ magasins, produits, initialData, onSave, onCancel }) {


  return (
    <form className="inventory-form" onSubmit={()=>{}}>
      <div className="form-group">
        <label htmlFor="date">Date de l'inventaire</label>
        <input
          type="date"
          id="date"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="produit">Produit</label>
        <select
          id="produit"
          required
        >
          <option value="">Sélectionner un produit</option>
          {produits.map((produit: Produit) => (
            <option key={produit.id} value={produit.id}>
              {produit.nom}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label>Stocks disponibles</label>
        {magasins.map((magasin: Magasin) => (
          <div key={magasin.id} className="magasin-stock">
            <label htmlFor={`stock-${magasin.id}`}>{magasin.nom}</label>
            <input
              type="number"
              id={`stock-${magasin.id}`}
              min="0"
              required
            />
          </div>
        ))}
      </div>
      <div className="form-actions">
        <button type="submit" className="btn-save">
          Enregistrer
        </button>
        <button type="button" className="btn-cancel" onClick={onCancel}>
          Annuler
        </button>
      </div>
    </form>
  );
}

function Modal({ children, isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>
        {children}
      </div>
    </div>
  );
}

function InventoryOverview({ onAddInventory }) {
  const [isModalOpen, setModalOpen] = useState(true);

  const handleCloseModal = () => {
    setModalOpen(false);
  };
  
  return (
    <div className="inventory-overview">
      <button className="add-inventory-btn" onClick={onAddInventory}>
        Ajouter un Inventaire
      </button>

      <InventoryTable
        produits={PRODUITS}
        magasins={MAGASINS}
        inventaires={INVENTAIRES}
      />

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <InventoryForm
          initialData={null}
          magasins={MAGASINS}
          produits={PRODUITS}
          onSave={() => {}}
          onCancel={() => {}}
        />
      </Modal>
    </div>
  );
}

const MAGASINS: Magasin[] = [
  { id: "1", nom: "Santa Lucia Kodengui", adresse: "Kodengui, Yaoundé" },
  { id: "2", nom: "Santa Lucia Mokolo", adresse: "Mokolo, Yaoundé" },
  { id: "3", nom: "Santa Lucia Mvan", adresse: "Mvan, Yaoundé" },
  { id: "4", nom: "Santa Lucia Ngousso", adresse: "Ngousso, Yaoundé" },
  { id: "5", nom: "Santa Lucia Nkolbisson", adresse: "Nkolbisson, Yaoundé" },
];

const PRODUITS: Produit[] = [
  { id: "1", nom: "Riz parfumé 5kg", prix: 4500 },
  { id: "2", nom: "Huile végétale 1L", prix: 1200 },
  { id: "3", nom: "Eau minérale 1,5L", prix: 500 },
  { id: "4", nom: "Farine de blé 1kg", prix: 1000 },
  { id: "5", nom: "Sucre en poudre 1kg", prix: 900 },
  { id: "6", nom: "Lait en poudre 400g", prix: 2500 },
  { id: "7", nom: "Poulet entier", prix: 5000 },
  { id: "8", nom: "Boisson gazeuse 1,5L", prix: 600 },
  { id: "9", nom: "Spaghetti 500g", prix: 600 },
  { id: "10", nom: "Sardines en conserve 125g", prix: 700 },
  { id: "11", nom: "Savon de ménage 400g", prix: 350 },
  { id: "12", nom: "Lessive en poudre 1kg", prix: 1500 },
  { id: "13", nom: "Papier hygiénique 6 rouleaux", prix: 2000 },
  { id: "14", nom: "Dentifrice 100ml", prix: 800 },
  { id: "15", nom: "Shampoing 500ml", prix: 2500 },
];


const INVENTAIRES: Inventaire[] = [
  {
    date: "2024-09-09",
    produitId: "1",
    stock: { "1": 50, "2": 30, "3": 20, "4": 15, "5": 10 },
  },
  {
    date: "2024-09-08",
    produitId: "2",
    stock: { "1": 100, "2": 70, "3": 40, "4": 25, "5": 60 },
  },
  {
    date: "2024-09-07",
    produitId: "3",
    stock: { "1": 25, "2": 20, "3": 15, "4": 10, "5": 30 },
  },
  {
    date: "2024-09-06",
    produitId: "4",
    stock: { "1": 75, "2": 55, "3": 45, "4": 35, "5": 60 },
  },
  {
    date: "2024-09-05",
    produitId: "5",
    stock: { "1": 200, "2": 150, "3": 100, "4": 80, "5": 120 },
  },
  {
    date: "2024-09-04",
    produitId: "6",
    stock: { "1": 300, "2": 250, "3": 200, "4": 180, "5": 220 },
  },
  {
    date: "2024-09-03",
    produitId: "7",
    stock: { "1": 10, "2": 8, "3": 5, "4": 3, "5": 6 },
  },
  {
    date: "2024-09-02",
    produitId: "8",
    stock: { "1": 5, "2": 4, "3": 3, "4": 2, "5": 1 },
  },
];

export default function InventoryApp() {
  return (
    <div>
      <h1>Gestion des Inventaires</h1>
      <InventoryOverview onAddInventory={() => {}} />
    </div>
  );
}
