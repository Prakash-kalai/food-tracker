import { useState, useEffect, useMemo } from "react";
import DeleteModal from "../subCompounds/DeleteModal"
import VendorCard from "../subCompounds/VendorCard"
import { initialVendors, isOpen } from "../utils";
import {
  TruckIcon,
  PlusIcon,  
  XMarkIcon,    
} from "@heroicons/react/24/solid";
import { v4 as uuidv4 } from "uuid";
import toast, { Toaster } from "react-hot-toast";


function Tracker() {
  const [vendors, setVendors] = useState(() => {
    const saved = localStorage.getItem("streetFoodVendors");
    return JSON.parse(saved) ;
  });
  const [showForm, setShowForm] = useState(false);
  const [editVendor, setEditVendor] = useState(null);
  const [filters, setFilters] = useState({ type: "all", status: "all" });
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    location: "",
    hours: "",
    menu: "",
    rating:0
  });
  const [formError, setFormError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [vendorToDelete, setVendorToDelete] = useState(null);

  useEffect(() => {
    localStorage.setItem(
      "streetFoodVendors",
      JSON.stringify(Array.isArray(vendors) && vendors.length ? vendors : initialVendors)
    );
    
  }, [vendors]);

  const validateHours = (hours) => {
    const regex =
      /^\d{1,2}(:\d{2})?\s*(AM|PM)\s*-\s*\d{1,2}(:\d{2})?\s*(AM|PM)$/i;
    return regex.test(hours.trim());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateHours(formData.hours)) {
      setFormError("Hours must be in format '11 AM - 3 PM'");
      return;
    }
    const vendorData = editVendor
      ? { ...editVendor, ...formData }
      : { ...formData, id: uuidv4(), reportedAt: new Date().toISOString() };
    setVendors(
      editVendor
        ? vendors.map((v) => (v.id === editVendor.id ? vendorData : v))
        : [vendorData, ...vendors]
    );
    toast.success(editVendor ? "Vendor updated!" : "Vendor added!");
    resetForm();
  };

  const handleEdit = (vendor) => {
    setEditVendor(vendor);
    setFormData({
      name: vendor.name,
      type: vendor.type,
      location: vendor.location,
      hours: vendor.hours,
      menu: vendor.menu,
    });
    setShowForm(true);
  };

  const handleDelete = (vendor) => {
    setVendorToDelete(vendor);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    setVendors(vendors.filter((v) => v.id !== vendorToDelete.id));
    toast.success("Vendor deleted!");
    setShowDeleteModal(false);
    setVendorToDelete(null);
  };

  const resetForm = () => {
    setShowForm(false);
    setEditVendor(null);
    setFormError("");
    setFormData({ name: "", type: "", location: "", hours: "", menu: "" });
  };

  const filteredVendors = useMemo(() => {
    let result = vendors.filter((v) => {
      const typeMatch = filters.type === "all" || v.type === filters.type;
      const statusMatch =
        filters.status === "all" ||
        (filters.status === "open" ? isOpen(v.hours) : !isOpen(v.hours));
      const searchMatch =
        v.name.toLowerCase().includes(search.toLowerCase()) ||
        v.location.toLowerCase().includes(search.toLowerCase());
      return typeMatch && statusMatch && searchMatch;
    });
    return result.sort((a, b) =>
      sortOrder === "desc"
        ? new Date(b.reportedAt) - new Date(a.reportedAt)
        : new Date(a.reportedAt) - new Date(b.reportedAt)
    );
  }, [vendors, filters, search, sortOrder]);

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <Toaster position="top-right" />
      <div className="max-w-5xl mx-auto">
        <header className="mb-8 flex items-center gap-4">
          <TruckIcon className="h-12 w-12 text-red-600" />
          <h1 className="text-4xl font-bold text-gray-800">
            Street Food Tracker
          </h1>
        </header>

        <div className="bg-white p-6 rounded-xl shadow-sm mb-8 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <button
              onClick={() => setShowForm(true)}
              className="bg-red-600 text-white px-6 py-2 rounded-lg flex items-center gap-2"
            >
              <PlusIcon className="h-5 w-5" /> Add Vendor
            </button>
            <input
              type="text"
              placeholder="Search by name or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-64 p-2 border rounded-lg"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="w-full sm:w-auto p-2 border rounded-lg"
            >
              {
                vendors.map((e)=>{
                  return(
                    <option value={e.type}>{e.type}</option>
                  )
                })
              }
            </select>
            <select
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
              className="w-full sm:w-auto p-2 border rounded-lg"
            >
              <option value="all">All Statuses</option>
              <option value="open">Open Now</option>
              <option value="closed">Closed</option>
            </select>
            <button
              onClick={() =>
                setSortOrder(sortOrder === "desc" ? "asc" : "desc")
              }
              className="w-full sm:w-auto bg-gray-200 text-gray-800 px-4 py-2 rounded-lg"
            >
              Sort by Time ({sortOrder === "desc" ? "Newest" : "Oldest"})
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {filteredVendors.length ? (
            filteredVendors.map((vendor) => (
              <VendorCard
                key={vendor.id}
                vendor={vendor}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))
          ) : (
            <p className="text-gray-600 text-center text-lg">
              No vendors match your criteria.
            </p>
          )}
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white p-6 rounded-xl max-w-lg w-full relative">
              <button
                onClick={resetForm}
                className="absolute top-4 right-4 text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
              <h2 className="text-2xl font-bold mb-6">
                {editVendor ? "Edit Vendor" : "Add New Vendor"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Name*
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">
                      Type*
                    </label>
                    <input
                      value={formData.type}
                      onChange={(e) =>
                        setFormData({ ...formData, type: e.target.value })
                      }
                      className="w-full p-2 border rounded-lg"
                    />
                     
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">
                      Hours*
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="e.g., 11 AM - 3 PM"
                      value={formData.hours}
                      onChange={(e) =>
                        setFormData({ ...formData, hours: e.target.value })
                      }
                      className="w-full p-2 border rounded-lg"
                    />
                    {formError && (
                      <p className="text-red-600 text-sm mt-1">{formError}</p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Location*
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Menu
                  </label>
                  <textarea
                    value={formData.menu}
                    onChange={(e) =>
                      setFormData({ ...formData, menu: e.target.value })
                    }
                    className="w-full p-2 border rounded-lg"
                    rows="3"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Rating*
                  </label>
                  <input
                    required
                    type="number"
                    value={formData.rating}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      if (value >= 1 && value <= 5) {
                        setFormData({ ...formData, rating: value });
                      }
                    }}
                    className="w-30px p-2 border rounded-lg"
                  />
                </div>
 
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-red-600 text-white py-2 rounded-lg"
                  >
                    {editVendor ? "Update" : "Submit"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      {showDeleteModal && (
          <DeleteModal
            vendor={vendorToDelete}
            onConfirm={confirmDelete}
            onCancel={() => setShowDeleteModal(false)}
          />
        )}
    </div>
    </div>
  );
}

export default Tracker;