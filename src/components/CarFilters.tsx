import { CAR_CATEGORIES } from "@/lib/supabase-helpers";
import { useLanguage } from "@/hooks/use-language";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Props = {
  category: string;
  setCategory: (c: string) => void;
};

const CarFilters = ({ category, setCategory }: Props) => {
  const { t } = useLanguage();
  const categories = ["All", ...CAR_CATEGORIES];

  return (
    <>
      {/* Mobile: select */}
      <div className="md:hidden">
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map((c) => (
              <SelectItem key={c} value={c}>{c === "All" ? t('carsPage.all') : c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {/* Desktop: pills */}
      <div className="hidden md:flex flex-wrap gap-2">
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
            {c === "All" ? t('carsPage.all') : c}
          </button>
        ))}
      </div>
    </>
  );
};

export default CarFilters;
