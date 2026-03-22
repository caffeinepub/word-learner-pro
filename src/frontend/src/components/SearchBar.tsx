import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Search, X } from "lucide-react";
import { useRef, useState } from "react";

interface SearchBarProps {
  query: string;
  onQueryChange: (q: string) => void;
  suggestions: string[];
  highlightEnabled: boolean;
  onHighlightToggle: (v: boolean) => void;
  onSuggestionSelect: (w: string) => void;
}

export function SearchBar({
  query,
  onQueryChange,
  suggestions,
  highlightEnabled,
  onHighlightToggle,
  onSuggestionSelect,
}: SearchBarProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="bg-card rounded-xl border border-border p-4 shadow-xs">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          />
          <Input
            ref={inputRef}
            data-ocid="search.search_input"
            placeholder="Search words..."
            value={query}
            onChange={(e) => {
              onQueryChange(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            className="pl-9 pr-9"
          />
          {query && (
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => {
                onQueryChange("");
                inputRef.current?.focus();
              }}
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}

          {/* Autocomplete dropdown */}
          {showSuggestions && suggestions.length > 0 && query && (
            <div
              data-ocid="search.popover"
              className="absolute z-50 top-full left-0 right-0 mt-1 bg-popover border border-border rounded-lg shadow-lg overflow-hidden"
            >
              {suggestions.map((s) => {
                const idx = s.toLowerCase().indexOf(query.toLowerCase());
                return (
                  <button
                    type="button"
                    key={s}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-accent transition-colors"
                    onMouseDown={() => {
                      onSuggestionSelect(s);
                      setShowSuggestions(false);
                    }}
                  >
                    {idx !== -1 ? (
                      <>
                        {s.slice(0, idx)}
                        <span className="font-semibold text-primary">
                          {s.slice(idx, idx + query.length)}
                        </span>
                        {s.slice(idx + query.length)}
                      </>
                    ) : (
                      s
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Switch
            data-ocid="search.highlight.switch"
            id="highlight-toggle"
            checked={highlightEnabled}
            onCheckedChange={onHighlightToggle}
          />
          <Label
            htmlFor="highlight-toggle"
            className="text-sm text-muted-foreground cursor-pointer"
          >
            Highlight matches
          </Label>
        </div>
      </div>
    </div>
  );
}
