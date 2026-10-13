import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Search } from "lucide-react";
import { useClinic } from "@/hooks/useClinic";

export function TopBar() {
  const { data: clinic } = useClinic();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (search.trim()) navigate(`/patients?search=${encodeURIComponent(search.trim())}`);
  }

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-bg-surface px-6">
      <span className="font-display text-[15px] font-semibold text-text-primary">
        {clinic?.name ?? "Clinic Manager"}
      </span>
      <form onSubmit={handleSearch} className="relative w-80">
        <Search
          size={14}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
        />
        <input
          placeholder="Search patient by phone or name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-9 w-full rounded-lg border border-border bg-bg-app px-3 pl-8 text-sm text-text-primary placeholder:text-text-secondary/70 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent-primary"
        />
      </form>
    </header>
  );
}
