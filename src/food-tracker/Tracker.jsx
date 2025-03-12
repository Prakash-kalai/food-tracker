import { useState, useEffect, useMemo } from "react";
import DeleteModal from "../subCompounds/DeleteModal";
import VendorCard from "../subCompounds/VendorCard";
import { initialVendors, isOpen } from "../utils";
import {
  TruckIcon,
  PlusIcon,  
  XMarkIcon,    
} from "@heroicons/react/24/solid";
import { v4 as uuidv4 } from "uuid";
import toast, { Toaster } from "react-hot-toast";

function Tracker() {
  const [vendors, setVendors] = useState([]);
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
    rating: 0
  });
  const [formError, setFormError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [vendorToDelete, setVendorToDelete] = useState(null);

  // Load vendors from localStorage after mount (Fixes hydration issues)
  useEffect(() => {
    const saved = localStorage.getItem("streetFoodVendors");
    if (saved) {
      try {
        setVendors(JSON.parse(saved));
      } catch (error) {
        setVendors(initialVendors);
      }
    } else {
      setVendors(initialVendors);
    }
  }, []);

  // Save vendors to localStorage
  useEffect(() => {
    if (vendors.length) {
      localStorage.setItem("streetFoodVendors", JSON.stringify(vendors));
    }
  }, [vendors]);

  const validateHours = (hours) => {
    const regex = /^\d{1,2}(:\d{2})?\s*(AM|PM)\s*-\s*\d{1,2}(:\d{2})?\s*(AM|PM)$/i;
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
      rating: vendor.rating || 0,
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
    setFormData({ name: "", type: "", location: "", hours: "", menu: "", rating: 0 });
  };

  const filteredVendors = useMemo(() => {
    if (!Array.isArray(vendors) || vendors.length === 0) return [];

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
          <h1 className="text-4xl font-bold text-gray-800">Street Food Tracker</h1>
        </header>

        <div className="bg-white p-6 rounded-xl shadow-sm mb-8 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <button onClick={() => setShowForm(true)} className="bg-red-600 text-white px-6 py-2 rounded-lg flex items-center gap-2">
              <PlusIcon className="h-5 w-5" /> Add Vendor
            </button>
            <input type="text" placeholder="Search by name or location..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full sm:w-64 p-2 border rounded-lg" />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <select value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value })} className="w-full sm:w-auto p-2 border rounded-lg">
              <option value="all">All Types</option>
              {[...new Set(vendors.map((v) => v.type))].map((type, index) => (
                <option key={index} value={type}>{type}</option>
              ))}
            </select>

            <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })} className="w-full sm:w-auto p-2 border rounded-lg">
              <option value="all">All Statuses</option>
              <option value="open">Open Now</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>

        <div className="space-y-6">
          {filteredVendors.length ? (
            filteredVendors.map((vendor) => (
              <VendorCard key={vendor.id} vendor={vendor} onEdit={handleEdit} onDelete={handleDelete} />
            ))
          ) : (
            <div className="text-gray-600 text-center text-lg">No vendors match your criteria.</div>
          )}
        </div>

        {showDeleteModal && <DeleteModal vendor={vendorToDelete} onConfirm={confirmDelete} onCancel={() => setShowDeleteModal(false)} />}
      </div>
    </div>
  );
}

export default Tracker;
