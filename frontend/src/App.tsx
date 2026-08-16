import { useEffect, useState } from "react";
import type { Asset } from "./Asset";
import type { Category } from "./Category";
import type { Employee } from "./Employee";
import type { Location } from "./Location";
import "./App.css";

function App() {
  const [page, setPage] = useState("Dashboard");
  const [assets, setAssets] = useState<Asset[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [newEmployeeName, setNewEmployeeName] = useState("");
  const [newEmployeeDepartment, setNewEmployeeDepartment] = useState("");
  const [editingEmployeeId, setEditingEmployeeId] = useState<number | null>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const [newLocationName, setNewLocationName] = useState("");
  const [editingLocationId, setEditingLocationId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
const [newAsset, setNewAsset] = useState<{
  assetName: string;
  serialNumber: string;
  categoryID: number;
  status: string;
  purchaseDate: string;
  employeeID: number | null;
  locationID: number | null;
}>({
  assetName: "",
  serialNumber: "",
  categoryID: 1,
  status: "Available",
  purchaseDate: "",
  employeeID: null,
  locationID: null,
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

useEffect(() => {
  fetch("http://localhost:5178/api/Categories")
    .then((response) => response.json())
    .then((data) => setCategories(data))
    .catch((error) => console.error(error));
}, []);

useEffect(() => {
  fetch("http://localhost:5178/api/Employees")
    .then((response) => response.json())
    .then((data) => setEmployees(data))
    .catch((error) =>
      console.error("Error fetching employees:", error)
    );
}, []);

useEffect(() => {
  fetch("http://localhost:5178/api/Locations")
    .then((response) => response.json())
    .then((data) => setLocations(data))
    .catch((error) =>
      console.error("Error fetching locations:", error)
    );
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
      purchaseDate: "",
      employeeID: null,
      locationID: null,
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
    employeeID: asset.employeeID,
    locationID: asset.locationID
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
      purchaseDate: "",
      employeeID: null,
      locationID: null,
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

const handleAddCategory = async () => {
  if (!newCategoryName.trim()) {
    return;
  }

  try {
    const response = await fetch(
      "http://localhost:5178/api/Categories",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          categoryName: newCategoryName,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to add category");
    }

    const createdCategory = await response.json();

    setCategories([...categories, createdCategory]);
    setNewCategoryName("");
  } catch (error) {
    console.error("Error adding category:", error);
  }
};

const handleDeleteCategory = async (categoryID: number) => {
  try {
    const response = await fetch(
      `http://localhost:5178/api/Categories/${categoryID}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete category");
    }

    setCategories(
      categories.filter(
        (category) => category.categoryID !== categoryID
      )
    );
  } catch (error) {
    console.error("Error deleting category:", error);
  }
};

const handleEditCategory = (category: Category) => {
  setEditingCategoryId(category.categoryID);
  setNewCategoryName(category.categoryName);
};

const handleUpdateCategory = async () => {
  if (editingCategoryId === null || !newCategoryName.trim()) {
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:5178/api/Categories/${editingCategoryId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          categoryID: editingCategoryId,
          categoryName: newCategoryName,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update category");
    }

    setCategories(
      categories.map((category) =>
        category.categoryID === editingCategoryId
          ? {
              ...category,
              categoryName: newCategoryName,
            }
          : category
      )
    );

    setNewCategoryName("");
    setEditingCategoryId(null);
  } catch (error) {
    console.error("Error updating category:", error);
  }
};

const handleAddEmployee = async () => {
  if (!newEmployeeName.trim() || !newEmployeeDepartment.trim()) {
    return;
  }

  try {
    const response = await fetch(
      "http://localhost:5178/api/Employees",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newEmployeeName,
          department: newEmployeeDepartment,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to add employee");
    }

    const createdEmployee = await response.json();

    setEmployees([...employees, createdEmployee]);

    setNewEmployeeName("");
    setNewEmployeeDepartment("");
  } catch (error) {
    console.error("Error adding employee:", error);
  }
};

const handleEditEmployee = (employee: Employee) => {
  setEditingEmployeeId(employee.employeeID);
  setNewEmployeeName(employee.name);
  setNewEmployeeDepartment(employee.department);
};

const handleUpdateEmployee = async () => {
  if (
    editingEmployeeId === null ||
    !newEmployeeName.trim() ||
    !newEmployeeDepartment.trim()
  ) {
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:5178/api/Employees/${editingEmployeeId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          employeeID: editingEmployeeId,
          name: newEmployeeName,
          department: newEmployeeDepartment,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update employee");
    }

    setEmployees(
      employees.map((employee) =>
        employee.employeeID === editingEmployeeId
          ? {
              ...employee,
              name: newEmployeeName,
              department: newEmployeeDepartment,
            }
          : employee
      )
    );

    setNewEmployeeName("");
    setNewEmployeeDepartment("");
    setEditingEmployeeId(null);
  } catch (error) {
    console.error("Error updating employee:", error);
  }
};

const handleDeleteEmployee = async (employeeID: number) => {
  try {
    const response = await fetch(
      `http://localhost:5178/api/Employees/${employeeID}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete employee");
    }

    setEmployees(
      employees.filter(
        (employee) => employee.employeeID !== employeeID
      )
    );
  } catch (error) {
    console.error("Error deleting employee:", error);
  }
};

const handleAddLocation = async () => {
  if (!newLocationName.trim()) {
    return;
  }

  try {
    const response = await fetch(
      "http://localhost:5178/api/Locations",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          locationName: newLocationName,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to add location");
    }

    const createdLocation = await response.json();

    setLocations([...locations, createdLocation]);

    setNewLocationName("");
  } catch (error) {
    console.error("Error adding location:", error);
  }
};

const handleEditLocation = (location: Location) => {
  setEditingLocationId(location.locationID);
  setNewLocationName(location.locationName);
};

const handleUpdateLocation = async () => {
  if (
    editingLocationId === null ||
    !newLocationName.trim()
  ) {
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:5178/api/Locations/${editingLocationId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          locationID: editingLocationId,
          locationName: newLocationName,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update location");
    }

    setLocations(
      locations.map((location) =>
        location.locationID === editingLocationId
          ? {
              ...location,
              locationName: newLocationName,
            }
          : location
      )
    );

    setNewLocationName("");
    setEditingLocationId(null);
  } catch (error) {
    console.error("Error updating location:", error);
  }
};

const handleDeleteLocation = async (locationID: number) => {
  try {
    const response = await fetch(
      `http://localhost:5178/api/Locations/${locationID}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete location");
    }

    setLocations(
      locations.filter(
        (location) => location.locationID !== locationID
      )
    );
  } catch (error) {
    console.error("Error deleting location:", error);
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

          <button onClick={() => setPage("Categories")}>
            Categories
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

                <label>Category</label>
                <select
                  value={newAsset.categoryID}
                  onChange={(event) =>
                  setNewAsset({
                    ...newAsset,
                    categoryID: Number(event.target.value),
                   })
                  }
                >
               {categories.map((category) => (
               <option
                key={category.categoryID}
                 value={category.categoryID}
                >
                {category.categoryName}
               </option>
                 ))}
                </select>

              <select
                value={newAsset.employeeID ?? ""}
                onChange={(event) =>
                    setNewAsset({
                     ...newAsset,
                    employeeID:
                      event.target.value === ""
                        ? null
                        : Number(event.target.value),
                })
               }
              >
                <option value="">Unassigned</option>

                {employees.map((employee) => (
                  <option
                     key={employee.employeeID}
                     value={employee.employeeID}
                  >
                   {employee.name}
                </option>
                ))}
              </select>

              <select
                value={newAsset.locationID ?? ""}
                  onChange={(event) =>
                    setNewAsset({
                      ...newAsset,
                      locationID:
                      event.target.value === ""
                      ? null
                      : Number(event.target.value),
                    })
                  }
              >
                <option value="">No Location</option>

                  {locations.map((location) => (
                <option
                  key={location.locationID}
                  value={location.locationID}
                >
                  {location.locationName}
                </option>
                ))}
              </select>

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
                  <th>Category</th>
                  <th>Status</th>
                   <th>Assigned To</th>
                   <th>Location</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredAssets.map((asset) => (
                  <tr key={asset.assetID}>
                    <td>{asset.assetID}</td>
                    <td>{asset.assetName}</td>
                    <td>{asset.serialNumber}</td>
                    <td>
                      {categories.find(
                        (category) => category.categoryID === asset.categoryID
                      )?.categoryName}
                    </td>
                    <td>{asset.status}</td>
                    <td>
                      {asset.employeeID === null
                      ? "Unassigned"
                      : employees.find(
                        (employee) =>
                          employee.employeeID === asset.employeeID
                      )?.name || "Unknown"}
                    </td>
                    <td>
                      {asset.locationID === null
                        ? "No Location"
                        : locations.find(
                        (location) =>
                          location.locationID === asset.locationID
                          )?.locationName || "Unknown"}
                    </td>
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

        {page === "Categories" && (
          <div className="categories">
            <div>
             <input
               type="text"
               placeholder="Category Name"
               value={newCategoryName}
               onChange={(event) => setNewCategoryName(event.target.value)}
             />
           <button
              onClick={
                 editingCategoryId === null
                  ? handleAddCategory
                  : handleUpdateCategory
               }
            >
             {editingCategoryId === null
              ? "Add Category"
              : "Update Category"}
            </button>
            </div>

            <table>
             <thead>
               <tr>
                 <th>ID</th>
                 <th>Category Name</th>
                 <th>Actions</th>
               </tr>
             </thead>

              <tbody>
               {categories.map((category) => (
                <tr key={category.categoryID}>
                  <td>{category.categoryID}</td>
                  <td>{category.categoryName}</td>
                  <td>
                    <button
                      onClick={() => handleEditCategory(category)}
                    >
                       Edit
                    </button>

                    <button
                      onClick={() => handleDeleteCategory(category.categoryID)}
                    >
                       Delete
                    </button>
                 </td>
               </tr>
              ))}
              </tbody>
            </table>
         </div>
        )}

        {page === "Employees" && (
  <div className="employees">

    <div className="employee-form">
      <input
        type="text"
        placeholder="Employee Name"
        value={newEmployeeName}
        onChange={(event) =>
          setNewEmployeeName(event.target.value)
        }
      />

      <input
        type="text"
        placeholder="Department"
        value={newEmployeeDepartment}
        onChange={(event) =>
          setNewEmployeeDepartment(event.target.value)
        }
      />

      <button
        onClick={
          editingEmployeeId === null
          ? handleAddEmployee
          : handleUpdateEmployee
        }
      >
        {editingEmployeeId === null
        ? "Add Employee"
        : "Update Employee"}
     </button>
  </div>

    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Department</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {employees.map((employee) => (
          <tr key={employee.employeeID}>
            <td>{employee.employeeID}</td>
            <td>{employee.name}</td>
            <td>{employee.department}</td>
            <td>
              <button
                onClick={() => handleEditEmployee(employee)}
              >
                Edit
              </button>

              <button
                  onClick={() => handleDeleteEmployee(employee.employeeID)}
               >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}

{page === "Locations" && (
  <div className="locations">
    <div className="location-form">
      <input
        type="text"
        placeholder="Location Name"
        value={newLocationName}
        onChange={(event) =>
          setNewLocationName(event.target.value)
        }
      />

     <button
       onClick={
        editingLocationId === null
        ? handleAddLocation
        : handleUpdateLocation
        }
      >
        {editingLocationId === null
          ? "Add Location"
          : "Update Location"}
      </button>
    </div>

    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Location Name</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {locations.map((location) => (
          <tr key={location.locationID}>
            <td>{location.locationID}</td>
            <td>{location.locationName}</td>
            <td>
              <button
                onClick={() => handleEditLocation(location)}
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteLocation(location.locationID)}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}

      </main>
    </div>
  );
}

export default App;