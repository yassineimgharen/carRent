import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import CarCard from "@/components/CarCard";
import CarFilters from "@/components/CarFilters";
import { fetchCars } from "@/lib/supabase-helpers";

const CarsPage = () => {
  const { data: cars, isLoading } = useQuery({ queryKey: ["cars"], queryFn: fetchCars });
  const [category, setCategory] = useState("All");
  const [maxPrice, setMaxPrice] = useState(500);

  const filtered = (cars ?? []).filter((c) => {
    if (category !== "All" && c.category !== category) return false;
    if (c.price_per_day > maxPrice) return false;
    return true;
  });

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container pt-24 pb-16 space-y-8">
        <div>
          <h1 className="font-display text-3xl md:text-4xl font-bold">Our Fleet</h1>
          <p className="text-muted-foreground mt-2">Find and book your perfect ride</p>
        </div>

        <CarFilters category={category} setCategory={setCategory} maxPrice={maxPrice} setMaxPrice={setMaxPrice} />

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="glass-card h-80 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((car, i) => (
              <CarCard key={car.id} car={car} index={i} animate />
            ))}
            {filtered.length === 0 && (
              <p className="text-muted-foreground col-span-full text-center py-12">No cars match your filters.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CarsPage;
