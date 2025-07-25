import { Trans } from "@lingui/react/macro";
import { getName, getVersion } from "@tauri-apps/api/app";
import { CogIcon, CpuIcon, ExternalLinkIcon } from "lucide-react";
import { useState } from "react";

import Shortcut from "@/components/shortcut";
import { useHypr } from "@/contexts";
import { openURL } from "@/utils/shell";
import { commands as windowsCommands } from "@hypr/plugin-windows";
import { Button } from "@hypr/ui/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@hypr/ui/components/ui/dropdown-menu";
import { cn } from "@hypr/ui/lib/utils";
import { useQuery } from "@tanstack/react-query";

export function SettingsButton() {
  const [open, setOpen] = useState(false);
  const { userId } = useHypr();

  const versionQuery = useQuery({
    queryKey: ["appVersion"],
    queryFn: async () => {
      const [version, name] = await Promise.all([getVersion(), getName()]);
      return `${name} ${version}`;
    },
  });

  const handleClickSettings = () => {
    setOpen(false);
    windowsCommands.windowShow({ type: "settings" });
  };

  const handleClickProfile = () => {
    setOpen(false);
    windowsCommands.windowShow({ type: "human", value: userId });
  };

  const handleClickPlans = () => {
    setOpen(false);
    windowsCommands.windowShow({ type: "plans" });
  };

  const handleClickChangelog = async () => {
    setOpen(false);
    try {
      await openURL("https://hyprnote.canny.io/changelog");
    } catch (error) {
      console.error("Failed to open changelog:", error);
    }
  };

  const handleClickTalkToFounders = async () => {
    setOpen(false);
    try {
      await openURL("https://hyprnote.canny.io/others-general-feedback/p/talk-to-founders");
    } catch (error) {
      console.error("Failed to open talk to founders:", error);
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="hover:bg-neutral-200">
          <CogIcon className="size-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-52 p-0">
        <div
          className={cn([
            "px-2 py-3 bg-gradient-to-r rounded-t-md relative overflow-hidden cursor-pointer",
            "from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800",
          ])}
          onClick={handleClickPlans}
        >
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDIwIDAgTCAwIDAgTCAwIDIwIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4xNSkiIHN0cm9rZS13aWR0aD0iMS41Ii8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-70">
          </div>
          <div className="flex items-center gap-3 text-white relative z-10">
            <CpuIcon className="size-8 animate-pulse" />
            <div>
              <div className="font-medium">
                <Trans>Local mode</Trans>
              </div>
              <div className="text-xs text-white/80 mt-0.5">
                Privacy-focused AI
              </div>
            </div>
          </div>
        </div>

        <div className="p-1">
          <DropdownMenuItem
            onClick={handleClickSettings}
            className="cursor-pointer"
          >
            <Trans>Settings</Trans>
            <Shortcut macDisplay="⌘," windowsDisplay="Ctrl+," />
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleClickProfile}
            className="cursor-pointer"
          >
            <Trans>My Profile</Trans>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleClickTalkToFounders}
            className="cursor-pointer"
          >
            <Trans>Talk to Founders</Trans>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleClickChangelog}
            className="cursor-pointer text-xs text-muted-foreground hover:text-foreground"
          >
            <div className="flex items-center gap-1">
              <span>{versionQuery.data ?? "..."}</span>
              <ExternalLinkIcon className="h-2.5 w-2.5 scale-75" style={{ strokeWidth: 2 }} />
            </div>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
