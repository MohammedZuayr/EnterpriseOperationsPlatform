import { useEffect, useState } from "react";
import type { Asset } from "./Asset";
import "./App.css";

function App() {
  const [page, setPage] = useState("Dashboard");
  const [assets, setAssets] = useState<Asset[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAsset, setNewAsset] = useState({
    assetName: "",
    serialNumber: "",
    categoryID: 1,
    status: "Available",
    purchaseDate: ""
  });
  const [editingAssetId, setEditingAssetId] = useState<number | null>(null);

  const filteredAssets = assets.filter((asset) => {
  const matchesSearch =
    asset.assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.serialNumber.toLowerCase().includes(searchTerm.toLowerCase());

  const matchesStatus =
    statusFilter === "All" || asset.status === statusFilter;

  return matchesSearch && matchesStatus;
});

  useEffect(() => {
  fetch("http://localhost:5178/api/Assets")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch assets.");
      }

      return response.json();
    })
    .then((data: Asset[]) => {
      setAssets(data);
      setLoading(false);
    })
    .catch((error) => {
      console.error(error);
      setError("Unable to load assets.");
      setLoading(false);
    });
}, []);

const handleAddAsset = async () => {
  try {
    const response = await fetch("http://localhost:5178/api/Assets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newAsset),
    });

    if (!response.ok) {
      throw new Error("Failed to create asset.");
    }

    const createdAsset: Asset = await response.json();

    setAssets((currentAssets) => [...currentAssets, createdAsset]);

    setShowAddForm(false);

    setNewAsset({
      assetName: "",
      serialNumber: "",
      categoryID: 1,
      status: "Available",
      purchaseDate: ""
    });
  } catch (error) {
    console.error(error);
  }
};

const handleEditAsset = (asset: Asset) => {
  setEditingAssetId(asset.assetID);

  setNewAsset({
    assetName: asset.assetName,
    serialNumber: asset.serialNumber,
    categoryID: asset.categoryID,
    status: asset.status,
    purchaseDate: asset.purchaseDate
      ? asset.purchaseDate.substring(0, 10)
      : "",
  });

  setShowAddForm(true);
};

const handleUpdateAsset = async () => {
  if (editingAssetId === null) {
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:5178/api/Assets/${editingAssetId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          assetID: editingAssetId,
          ...newAsset,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update asset.");
    }

    setAssets((currentAssets) =>
      currentAssets.map((asset) =>
        asset.assetID === editingAssetId
          ? {
              ...asset,
              assetID: editingAssetId,
              ...newAsset,
            }
          : asset
      )
    );

    setEditingAssetId(null);
    setShowAddForm(false);

    setNewAsset({
      assetName: "",
      serialNumber: "",
      categoryID: 1,
      status: "Available",
      purchaseDate: ""
    });
  } catch (error) {
    console.error(error);
  }
};

const handleDeleteAsset = async (id: number) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this asset?"
  );

  if (!confirmed) {
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:5178/api/Assets/${id}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete asset.");
    }

    setAssets((currentAssets) =>
      currentAssets.filter((asset) => asset.assetID !== id)
    );
  } catch (error) {
    console.error(error);
  }
};

const totalAssets = assets.length;

const availableAssets = assets.filter(
  (asset) => asset.status === "Available"
).length;

const assignedAssets = assets.filter(
  (asset) => asset.status === "Assigned"
).length;

  return (
    <div className="app">
      <aside className="sidebar">
        <h2>ITAM</h2>

        <nav>
          <button onClick={() => setPage("Dashboard")}>
            Dashboard
          </button>

          <button onClick={() => setPage("Assets")}>
            Assets
          </button>
        </nav>
      </aside>

      <main className="content">
        <h1>{page}</h1>

        {page === "Dashboard" && (
          <div className="dashboard">
            <div className="card">
              <h3>Total Assets</h3>
              <p>{totalAssets}</p>
            </div>

            <div className="card">
              <h3>Available</h3>
              <p>{availableAssets}</p>
            </div>

            <div className="card">
              <h3>Assigned</h3>
              <p>{assignedAssets}</p>
            </div>
          </div>
        )}

        {page === "Assets" && (
          <div className="assets">
            <button onClick={() => setShowAddForm(true)}>
              Add Asset
            </button>

            {showAddForm && (
              <div className="asset-form">
                <h2>
                  {editingAssetId === null ? "Add Asset" : "Edit Asset"}
                </h2>

                <input
                  type="text"
                  placeholder="Asset Name"
                  value={newAsset.assetName}
                 onChange={(event) =>
                  setNewAsset({
                    ...newAsset,
                    assetName: event.target.value,
                   })
                 }
                />

                <input
                  type="text"
                  placeholder="Serial Number"
                  value={newAsset.serialNumber}
                  onChange={(event) =>
                   setNewAsset({
                    ...newAsset,
                    serialNumber: event.target.value,
                    })
                  }
                />

                <select
                  value={newAsset.status}
                  onChange={(event) =>
                    setNewAsset({
                      ...newAsset,
                      status: event.target.value,
                    })
                  }
                >
                  <option value="Available">Available</option>
                  <option value="Assigned">Assigned</option>
                </select>

                <input
                  type="date"
                  value={newAsset.purchaseDate}
                  onChange={(event) =>
                    setNewAsset({
                      ...newAsset,
                      purchaseDate: event.target.value,
                    })
                   }
                />

                <button
                  onClick={
                    editingAssetId === null
                    ? handleAddAsset
                    : handleUpdateAsset
                  }
                  >
                  Save Asset
                </button>

                <button onClick={() => setShowAddForm(false)}>
                   Cancel
                </button>
              </div>
            )}

            <input
              type="text"
              placeholder="Search assets..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="All">All</option>
              <option value="Available">Available</option>
               <option value="Assigned">Assigned</option>
            </select>

            {loading && <p>Loading assets...</p>}

            {error && <p>{error}</p>}

          {!loading && !error && (
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Asset Name</th>
                  <th>Serial Number</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredAssets.map((asset) => (
                  <tr key={asset.assetID}>
                    <td>{asset.assetID}</td>
                    <td>{asset.assetName}</td>
                    <td>{asset.serialNumber}</td>
                    <td>{asset.status}</td>
                   <td>
                    <button onClick={() => handleEditAsset(asset)}>
                       Edit
                    </button>

                    <button onClick={() => handleDeleteAsset(asset.assetID)}>
                        Delete
                    </button>
                  </td>
                 </tr>
              ))}
              </tbody>
            </table>
            )}
          </div>
        )}
        
      </main>
    </div>
  );
}

export default App;