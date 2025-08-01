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
        className="bg-[#0a0a0a] text-white rounded-xl shadow-2xl border border-orange-500/10 w-full max-w-lg"
      >
        <Command className="w-full">
          {/* Input */}
          <CommandInput
            value={value}
            onValueChange={setValue}
            placeholder="What do you need?"
            className="border-b border-orange-500/10 bg-[#0a0a0a] text-white p-4 text-base placeholder:text-orange-300 focus:outline-none"
          />

          {/* List */}
          <CommandList className="p-3 max-h-[300px] overflow-y-auto">
            <CommandEmpty className="text-sm text-orange-300">
              No results for <span className="text-orange-400">"{value}"</span>
            </CommandEmpty>

            {/* Team Section */}
            <CommandGroup
              heading="Team"
              className="text-xs uppercase tracking-wide text-orange-400 px-2 mb-2"
            >
              <CommandItem className="flex items-center gap-2 px-3 py-2 text-sm rounded-md transition hover:bg-orange-400/10 hover:text-orange-300 cursor-pointer">
                <Plus className="w-4 h-4" />
                Invite Member
              </CommandItem>
              <CommandItem className="flex items-center gap-2 px-3 py-2 text-sm rounded-md transition hover:bg-orange-400/10 hover:text-orange-300 cursor-pointer">
                <Eye className="w-4 h-4" />
                See Org Chart
              </CommandItem>
            </CommandGroup>

            {/* Integrations Section */}
            <CommandGroup
              heading="Integrations"
              className="text-xs uppercase tracking-wide text-orange-400 px-2 mt-4"
            >
              <p className="text-sm text-gray-500 px-3 py-2 italic">Coming soon...</p>
            </CommandGroup>
          </CommandList>
        </Command>
      </div>
    </div>
  );
};
