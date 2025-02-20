import { GiCupcake } from 'react-icons/gi'; // Using cupcake icon instead
// or
import { MdBakeryDining } from 'react-icons/md'; // For bakery icon
// or
import { FaIceCream } from 'react-icons/fa'; // For dessert icon

export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
        <GiCupcake className="text-white text-xl" />
        {/* or */}
        {/* <MdBakeryDining className="text-white text-xl" /> */}
        {/* or */}
        {/* <FaIceCream className="text-white text-xl" /> */}
      </div>
      <span className="text-xl font-bold text-secondary">
        The Desserts Site
      </span>
    </div>
  );
} 