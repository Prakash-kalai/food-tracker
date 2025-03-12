import { v4 as uuidv4 } from "uuid";

export const initialVendors = [
  {
    id: uuidv4(),
    name: "Coimbatore Thatu Vadai",
    type: "Thatu Vadai",
    location: "Gandhipuram, Coimbatore",
    hours: "4 PM - 9 PM",
    menu: "Spicy Thatu Vadai, Butter Thatu Vadai",
    rating:3,
    reportedAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    name: "Kanyakumari Banana Chips",
    type: "Banana Chips",
    location: "Beach Road, Kanyakumari",
    hours: "10 AM - 8 PM",
    menu: "Salted Banana Chips, Masala Banana Chips",
    rating:3,
    reportedAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id:uuidv4(),
    name: "Kumar's Kothu Parotta",
    type: "Kothu Parotta",
    location: "Anna Nagar, Chennai",
    hours: "6 PM - 12 AM",
    menu: "Egg Kothu Parotta, Chicken Kothu Parotta",
    rating:3,
    reportedAt: "2025-03-06T14:00:00.000Z"
  },
  {
    id: uuidv4(),
    name: "Murugan Idli Shop",
    type: "Idli, Dosa",
    location: "T. Nagar, Chennai",
    hours: "7 AM - 10 PM",
    menu: "Ghee Idli, Podi Dosa, Filter Coffee",
    rating:3,
    reportedAt: "2025-03-06T14:10:00.000Z"
  },
  {
    id: uuidv4(),
    name: "Madurai Jigarthanda",
    type: "Jigarthanda",
    location: "West Masi Street, Madurai",
    hours: "10 AM - 11 PM",
    menu: "Regular Jigarthanda, Special Jigarthanda",
    rating:3,
    reportedAt: "2025-03-06T14:20:00.000Z",    
  },
  {
    id:uuidv4(),
    name: "Kari Dosa Kadai",
    type: "Kari Dosa",
    location: "Goripalayam, Madurai",
    hours: "6 PM - 11 PM",
    menu: "Mutton Kari Dosa, Chicken Kari Dosa",
    rating:3,
    reportedAt: "2025-03-06T14:30:00.000Z"
  },
  {
    id: uuidv4(),
    name: "Coimbatore Thatu Vadai",
    type: "Thatu Vadai",
    location: "Gandhipuram, Coimbatore",
    hours: "4 PM - 9 PM",
    menu: "Spicy Thatu Vadai, Butter Thatu Vadai",
    rating:3,
    reportedAt: "2025-03-06T14:40:00.000Z"
  },
  {
    id:uuidv4(),
    name: "Kanyakumari Banana Chips",
    type: "Banana Chips",
    location: "Beach Road, Kanyakumari",
    hours: "10 AM - 8 PM",
    menu: "Salted Banana Chips, Masala Banana Chips",
    rating:3,
    reportedAt: "2025-03-06T14:50:00.000Z"
  },
  {
    id: uuidv4(),
    name: "Thanjavur Thalaiyatti Dosai",
    type: "Dosai",
    location: "Big Temple, Thanjavur",
    hours: "7 AM - 10 PM",
    menu: "Ghee Roast, Pesarattu",
    rating:3,
    reportedAt: "2025-03-06T15:00:00.000Z"
  },
  {
    id:uuidv4(),
    name: "Chettinad Kuzhi Paniyaram",
    type: "Paniyaram",
    location: "Karaikudi, Tamil Nadu",
    hours: "5 PM - 10 PM",
    menu: "Sweet Paniyaram, Spicy Paniyaram",
    rating:3,
    reportedAt: "2025-03-06T15:10:00.000Z"
  },
  {
    id:uuidv4(),
    name: "Vellore Bun Parotta",
    type: "Bun Parotta",
    location: "Gandhi Nagar, Vellore",
    hours: "6 PM - 11 PM",
    menu: "Bun Parotta with Salna",
    rating:3,
    reportedAt: "2025-03-06T15:20:00.000Z"
  },
  {
    id:uuidv4(),
    name: "Salem Egg Kalakki",
    type: "Kalakki",
    location: "Four Roads, Salem",
    hours: "6 PM - 12 AM",
    menu: "Egg Kalakki, Masala Kalakki",
    rating:3,
    reportedAt: "2025-03-06T15:30:00.000Z"
  }
  
];

export const isOpen = (hours) => {
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
