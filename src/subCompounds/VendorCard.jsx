import { TruckIcon, ClockIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import FoodRating from "./Rating";

const isOpen = (hours) => {
  const [start, end] = hours.split(" - ");
  const now = new Date();
  const currentHour = now.getHours() + now.getMinutes() / 60;

  const parseTime = (timeStr) => {
    const [time, modifier] = timeStr.split(" ");
    let [hours, minutes] = time.split(":").map(Number);
    if (modifier === "PM" && hours < 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;
    return hours + (minutes ? minutes / 60 : 0);
  };

  return currentHour >= parseTime(start) && currentHour <= parseTime(end);
};

const VendorCard = ({ vendor, onEdit, onDelete }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{vendor.name}</h2>
          <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-sm capitalize">
            {vendor.type}
          </span>
        </div>
        <div className="flex gap-2">
          <button onClick={() => onEdit(vendor)} className="text-blue-600 hover:text-blue-800">
            <PencilIcon className="h-5 w-5" />
          </button>
          <button onClick={() => onDelete(vendor)} className="text-red-600 hover:text-red-800">
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div className="space-y-2 text-gray-600">
        <p className="flex items-center gap-2">
          <TruckIcon className="h-5 w-5" /> {vendor.location}
        </p>
        <p className="flex items-center gap-2">
          <ClockIcon className="h-5 w-5" /> {vendor.hours}{" "}
          <span
            className={`px-2 py-1 rounded-full text-sm ${
              isOpen(vendor.hours) ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
            }`}
          >
            {isOpen(vendor.hours) ? "Open" : "Closed"}
          </span>
        </p>
        {vendor.menu && (
          <div className="mt-4">
            <h3 className="font-semibold text-gray-700">Menu:</h3>
            <p>{vendor.menu}</p>
          </div>
        )}
        <p className="text-sm text-gray-500 mt-2">Reported: {new Date(vendor.reportedAt).toLocaleString()}</p>
        <p><FoodRating vendor={vendor.rating}/></p>
      </div>
    </div>
  );
};

export default VendorCard;

