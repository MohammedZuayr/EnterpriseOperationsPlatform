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

          <button onClick={() => setPage("Employees")}>
            Employees
          </button>

          <button onClick={() => setPage("Locations")}>
            Locations
          </button>
        </nav>
      </aside>

      <main className="content">
        <h1>{page}</h1>

        {page === "Dashboard" && (
          <div className="dashboard">
            <div className="card">
              <h3>Total Assets</h3>
              <p>0</p>
            </div>

            <div className="card">
              <h3>Available</h3>
              <p>0</p>
            </div>

            <div className="card">
              <h3>Assigned</h3>
              <p>0</p>
            </div>
          </div>
        )}

        {page === "Assets" && (
          <div className="assets">
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
                </tr>
              </thead>

              <tbody>
                {filteredAssets.map((asset) => (
                  <tr key={asset.assetID}>
                    <td>{asset.assetID}</td>
                    <td>{asset.assetName}</td>
                    <td>{asset.serialNumber}</td>
                    <td>{asset.status}</td>
                 </tr>
              ))}
              </tbody>
            </table>
            )}
          </div>
        )}
        
        {page === "Employees" && (
          <p>Employee management will be added later.</p>
        )}

        {page === "Locations" && (
          <p>Location management will be added later.</p>
        )}
      </main>
    </div>
  );
}

export default App;