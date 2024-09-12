import React, { useEffect, useState } from "react";
import { unparse } from "papaparse";
import { useTranslation } from "react-i18next";

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

  const getStockClass = (stock) => {
    return stock < 10 ? "low-stock" : "high-stock";
  };

  const {t} = useTranslation()
  
  return (
    <tr
      onClick={() => onClickRow(inventaire.produitId)}
      className="inventory-row"
    >
      <td>{inventaire.date}</td>
      <td>{product ? product.nom : t("unknown_product")}</td>
      <td>{product ? product.prix : "NaN"} XAF</td>
      {magasins.map((magasin: Magasin) => (
        <td
          className={getStockClass(inventaire.stock[magasin.id])}
          key={magasin.id}
        >
          {inventaire.stock[magasin.id] !== null
            ? inventaire.stock[magasin.id]
            : "N/A"}
        </td>
      ))}
    </tr>
  );
}

function InventoryTable({ inventaires, magasins, produits, onClickRow }) {
  const {t} = useTranslation()
  return (
    <table className="inventory-table">
      <thead>
        <tr>
          <th rowSpan={2}>{t("date")}</th>
          <th rowSpan={2}>{t("product")}</th>
          <th rowSpan={2}>{t("price")}</th>
          <th colSpan={magasins.length} className="magasins-header">
            {t("stores")}
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

  const today = new Date().toISOString().split("T")[0];
  const {t} = useTranslation()

  return (
    <form className="inventory-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="date">{t("date_label")}</label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          max={today}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="produit">{t("product_label")}</label>
        <select
          id="produit"
          value={produitId}
          onChange={(e) => handleProduitChange(e.target.value)}
          required
        >
          <option value="">{t("select_product")}</option>
          {produits.map((produit: Produit) => (
            <option key={produit.id} value={produit.id}>
              {produit.nom}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label>{t("stock_label")}</label>
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
          {t("save_button")}
        </button>
        <button type="button" className="btn-cancel" onClick={onCancel}>
          {t("cancel_button")}
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
  const [inventaires, setInventaires] = useState<Inventaire[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const storedData = localStorage.getItem("inventaires");
    if (storedData) {
      setInventaires(JSON.parse(storedData));
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("inventaires", JSON.stringify(inventaires));
    }
  }, [inventaires, isInitialized]);

  const handleAddInventory = () => {
    setInitialData(undefined);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleOnSave = (inventaire: Inventaire) => {
    const existingIndex = inventaires.findIndex(
      (existing: Inventaire) => existing.produitId === inventaire.produitId
    );

    const newInventaires = [...inventaires];
    if (existingIndex > -1) {
      newInventaires[existingIndex] = inventaire;
    } else {
      newInventaires.push(inventaire);
    }
    setInventaires(newInventaires);
    setModalOpen(false);
  };

  const handleExportCSV = () => {
    const data = inventaires.map((inventaire) => {
      const produit =
        PRODUITS.find((p) => p.id === inventaire.produitId)?.nom ||
        "Produit inconnu";
      const row = { produit };
      row["date"] = inventaire.date;
      MAGASINS.forEach((magasin) => {
        row[magasin.nom] = inventaire.stock[magasin.id] || 0;
      });

      return row;
    });

    const headers = ["date", "produit", ...MAGASINS.map((m) => m.nom)];

    const csv = unparse({ fields: headers, data });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "inventaires.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSelectProduit = (id: string) => {
    setInitialData(
      inventaires.find((inventaire: Inventaire) => inventaire.produitId === id)
    );
    setModalOpen(true);
  };

  const { t } = useTranslation();

  return (
    <div className="inventory-overview">
      <div>
        <button className="add-inventory-btn" onClick={handleAddInventory}>
          {t("add_inventory")}
        </button>

        <button className="export-csv-btn" onClick={handleExportCSV}>
          {t("export_csv")}
        </button>
      </div>

      <InventoryTable
        onClickRow={handleSelectProduit}
        produits={PRODUITS}
        magasins={MAGASINS}
        inventaires={inventaires}
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

function NavBar() {
  const { i18n, t } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <nav className="navbar">
      <h1 className="navbar-title">{t("inventory_title")}</h1>
      <div className="navbar-languages">
        <button onClick={() => changeLanguage("fr")} className="lang-btn">
          <span role="img" aria-label="français">
            🇫🇷
          </span>{" "}
          Français
        </button>
        <button onClick={() => changeLanguage("en")} className="lang-btn">
          <span role="img" aria-label="english">
            🇬🇧
          </span>{" "}
          English
        </button>
      </div>
    </nav>
  );
}


export default function InventoryApp() {
  return (
    <div>
      <NavBar />
      <InventoryOverview />
    </div>
  );
}
