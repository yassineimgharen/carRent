import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/hooks/use-language";
import { CAR_CATEGORIES } from "@/lib/supabase-helpers";
import { motion } from "framer-motion";

const HeroSearchBar = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (category !== "All") params.set("category", category);
    navigate(`/cars?${params.toString()}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="flex flex-col sm:flex-row gap-2 p-2 glass-card max-w-xl"
    >
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder={t('search.placeholder')}
          className="pl-9 bg-background/60 border-0 focus-visible:ring-0"
        />
      </div>
      <Select value={category} onValueChange={setCategory}>
        <SelectTrigger className="w-full sm:w-40 bg-background/60 border-0 focus:ring-0">
          <SelectValue placeholder={t('search.allCategories')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="All">{t('search.allCategories')}</SelectItem>
          {CAR_CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
        </SelectContent>
      </Select>
      <Button onClick={handleSearch} className="rounded-full px-6 font-display shrink-0">
        {t('search.button')}
      </Button>
    </motion.div>
  );
};

export default HeroSearchBar;
