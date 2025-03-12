import { StarIcon } from "@heroicons/react/24/solid";

const FoodRating = ({ vendor }) => {    
    
  return (
    <div className="flex flex-col items-center p-2 bg-white shadow-lg rounded-lg w-[150px]">      
      <div className="flex">
        {[1, 2, 3, 4,5].map((star) => (
          <StarIcon
            key={star}
            className={`h-6 w-6 cursor-none transition-colors ${
              (vendor) >= star ? "text-yellow-400" : "text-gray-300"
            }`}
            
          />
        ))}
      </div>
      
    </div>
  );
};

export default FoodRating;
