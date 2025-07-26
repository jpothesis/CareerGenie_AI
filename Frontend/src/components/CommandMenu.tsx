'use client';

import * as React from "react";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "cmdk";
import { Eye, Plus } from "lucide-react";

type CommandMenuProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export const CommandMenu: React.FC<CommandMenuProps> = ({ open, setOpen }) => {
  const [value, setValue] = React.useState("");

  if (!open) return null;

  return (
    <div
      onClick={() => setOpen(false)}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-lg shadow-xl border overflow-hidden w-full max-w-lg"
      >
        <Command className="w-full">
          <CommandInput
            value={value}
            onValueChange={setValue}
            placeholder="What do you need?"
            className="border-b border-stone-300 p-3 text-lg w-full placeholder:text-stone-400 focus:outline-none"
          />
          <CommandList className="p-3 max-h-[300px] overflow-y-auto">
            <CommandEmpty className="text-sm text-stone-500">
              No results for <span className="text-violet-500">"{value}"</span>
            </CommandEmpty>

            <CommandGroup heading="Team" className="text-sm mb-3 text-stone-400">
              <CommandItem className="flex items-center gap-2 p-2 text-sm text-stone-950 hover:bg-stone-200 rounded cursor-pointer transition">
                <Plus className="w-4 h-4" />
                Invite Member
              </CommandItem>
              <CommandItem className="flex items-center gap-2 p-2 text-sm text-stone-950 hover:bg-stone-200 rounded cursor-pointer transition">
                <Eye className="w-4 h-4" />
                See Org Chart
              </CommandItem>
            </CommandGroup>

            <CommandGroup heading="Integrations" className="text-sm mb-3 text-stone-400">
              {/* Add more CommandItems here if needed */}
            </CommandGroup>
          </CommandList>
        </Command>
      </div>
    </div>
  );
};
