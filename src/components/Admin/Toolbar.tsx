import { ChangeEvent } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface ToolbarProps {
  onSearch: (query: string) => void;
  onImport: (json: string) => void;
  onExport: () => void;
  actions?: React.ReactNode;
  searchPlaceholder?: string;
}

export const Toolbar = ({ onSearch, onImport, onExport, actions, searchPlaceholder }: ToolbarProps) => {
  const handleImport = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        onImport(reader.result);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-canaria-dark/15 bg-white/80 p-4 sm:flex-row sm:items-center sm:justify-between">
      <Input
        type="search"
        placeholder={searchPlaceholder ?? "検索"}
        onChange={(event) => onSearch(event.target.value)}
        className="sm:max-w-xs"
      />
      <div className="flex flex-wrap items-center gap-3">
        {actions}
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" onClick={onExport}>
            JSONエクスポート
          </Button>
          <Button type="button" variant="outline" asChild>
            <label className="cursor-pointer">
              JSONインポート
              <input type="file" accept="application/json" className="hidden" onChange={handleImport} />
            </label>
          </Button>
        </div>
      </div>
    </div>
  );
};
