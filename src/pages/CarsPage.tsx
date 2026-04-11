import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import CarCard from "@/components/CarCard";
import CarFilters from "@/components/CarFilters";
import { fetchCars } from "@/lib/supabase-helpers";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";

const CarsPage = () => {
  const { data: cars, isLoading } = useQuery({ queryKey: ["cars"], queryFn: fetchCars });
  const [searchParams] = useSearchParams();
  const { t } = useLanguage();
  const [category, setCategory] = useState(searchParams.get("category") || "All");
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");

  useEffect(() => {
    setCategory(searchParams.get("category") || "All");
    setSearchQuery(searchParams.get("q") || "");
  }, [searchParams]);

  const filtered = (cars ?? []).filter((c) => {
    if (category !== "All" && c.category !== category) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchName = c.name.toLowerCase().includes(query);
      const matchBrand = c.brand.toLowerCase().includes(query);
      if (!matchName && !matchBrand) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container pt-24 pb-16 space-y-8">
        <div>
          <h1 className="font-display text-3xl md:text-4xl font-bold">{t('carsPage.title')}</h1>
          <p className="text-muted-foreground mt-2">{t('carsPage.subtitle')}</p>
        </div>

        <CarFilters category={category} setCategory={setCategory} />

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('carsPage.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="glass-card overflow-hidden">
                <div className="skeleton aspect-[3/2]" />
                <div className="p-5 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="skeleton h-3 w-16" />
                      <div className="skeleton h-5 w-28" />
                    </div>
                    <div className="space-y-2 items-end flex flex-col">
                      <div className="skeleton h-6 w-20" />
                      <div className="skeleton h-3 w-12" />
                    </div>
                  </div>
                  <div className="flex items-center gap-4 pt-1 border-t border-border/50">
                    <div className="skeleton h-3 w-8" />
                    <div className="skeleton h-3 w-16" />
                    <div className="skeleton h-3 w-14" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((car, i) => (
              <CarCard key={car.id} car={car} index={i} animate />
            ))}
            {filtered.length === 0 && (
              <p className="text-muted-foreground col-span-full text-center py-12">{t('carsPage.noResults')}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CarsPage;
