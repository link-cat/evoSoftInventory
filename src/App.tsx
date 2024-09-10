import React, { useEffect, useState } from "react";

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

function InventoryRow({ inventaire, magasins, produits, onClickRow }) {
  const product = produits.find((p: Produit) => p.id === inventaire.produitId);

  return (
    <tr
      onClick={() => onClickRow(inventaire.produitId)}
      className="inventory-row"
    >
      <td>{inventaire.date}</td>
      <td>{product ? product.nom : "Unknown Product"}</td>
      <td>{product ? product.prix : "NaN"} XAF</td>
      {magasins.map((magasin: Magasin) => (
        <td key={magasin.id}>
          {inventaire.stock[magasin.id] !== null
            ? inventaire.stock[magasin.id]
            : "N/A"}
        </td>
      ))}
    </tr>
  );
}

function InventoryTable({ inventaires, magasins, produits, onClickRow }) {
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
          {magasins.map((magasin: Magasin) => (
            <th key={magasin.id}>{magasin.nom}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {inventaires.map((inventaire: Inventaire) => (
          <InventoryRow
            onClickRow={onClickRow}
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

function InventoryForm({
  magasins,
  produits,
  initialData,
  onSave,
  onCancel,
  onSelectProduct,
}) {
  const [date, setDate] = useState(initialData ? initialData.date : "");
  const [produitId, setProduitId] = useState(
    initialData ? initialData.produitId : ""
  );
  const [stocks, setStocks] = useState(
    initialData
      ? initialData.stock
      : magasins.reduce(
          (acc, magasin: Magasin) => ({ ...acc, [magasin.id]: 0 }),
          {}
        )
  );

  useEffect(() => {
    if (initialData) {
      setDate(initialData.date);
      setProduitId(initialData.produitId);
      setStocks(initialData.stock);
    } else {
      setDate("");
      setProduitId("");
      setStocks(
        magasins.reduce(
          (acc, magasin: Magasin) => ({ ...acc, [magasin.id]: 0 }),
          {}
        )
      );
    }
  }, [initialData, magasins]);

  const handleProduitChange = (id: string) => {
    onSelectProduct(id);
    setProduitId(id);
  };

  const handleStockChange = (magasinId: string, newStock: number) => {
    setStocks({
      ...stocks,
      [magasinId]: newStock,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const inventaire = {
      date,
      produitId,
      stock: stocks,
    };
    onSave(inventaire);
  };

  return (
    <form className="inventory-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="date">Date de l'inventaire</label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="produit">Produit</label>
        <select
          id="produit"
          value={produitId}
          onChange={(e) => handleProduitChange(e.target.value)}
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
              value={stocks[magasin.id]}
              onChange={(e) =>
                handleStockChange(magasin.id, parseInt(e.target.value, 10) || 0)
              }
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

function InventoryOverview() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [initialData, setInitialData] = useState<Inventaire | undefined>(
    undefined
  );

  const handleAddInventory = () => {
    setInitialData(undefined);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleOnSave = (inventaire: Inventaire) => {
    const existingIndex = INVENTAIRES.findIndex(
      (existing: Inventaire) => existing.produitId === inventaire.produitId
    );
    if (existingIndex > -1) {
      INVENTAIRES[existingIndex] = inventaire;
    } else {
      INVENTAIRES.push(inventaire);
    }
    setModalOpen(false);
  };

  const handleSelectProduit = (id: string) => {
    setInitialData(
      INVENTAIRES.find((inventaire: Inventaire) => inventaire.produitId === id)
    );
    setModalOpen(true);
  };

  return (
    <div className="inventory-overview">
      <button className="add-inventory-btn" onClick={handleAddInventory}>
        Ajouter un Inventaire
      </button>

      <InventoryTable
        onClickRow={handleSelectProduit}
        produits={PRODUITS}
        magasins={MAGASINS}
        inventaires={INVENTAIRES}
      />

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <InventoryForm
          onSelectProduct={handleSelectProduit}
          initialData={initialData}
          magasins={MAGASINS}
          produits={PRODUITS}
          onSave={handleOnSave}
          onCancel={handleCloseModal}
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

let INVENTAIRES: Inventaire[] = [];

export default function InventoryApp() {
  return (
    <div>
      <h1>Gestion des Inventaires</h1>
      <InventoryOverview />
    </div>
  );
}
