import { CAR_CATEGORIES } from "@/lib/supabase-helpers";
import { Slider } from "@/components/ui/slider";

type Props = {
  category: string;
  setCategory: (c: string) => void;
  maxPrice: number;
  setMaxPrice: (p: number) => void;
};

const CarFilters = ({ category, setCategory, maxPrice, setMaxPrice }: Props) => {
  const categories = ["All", ...CAR_CATEGORIES];

  return (
    <div className="space-y-6">
      {/* Category pills */}
      <div className="flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              category === c
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Price slider */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground whitespace-nowrap">Max price:</span>
        <Slider
          value={[maxPrice]}
          onValueChange={([v]) => setMaxPrice(v)}
          min={0}
          max={1000}
          step={10}
          className="flex-1"
        />
        <span className="font-display font-semibold text-primary w-20 text-right">${maxPrice}/day</span>
      </div>
    </div>
  );
};

export default CarFilters;
