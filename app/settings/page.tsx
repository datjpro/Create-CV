import { PrivateRouteShell } from "@/components/auth/private-route-shell";
import { SettingsScreen } from "@/components/settings/settings-screen";

export default function SettingsPage() {
  return (
    <PrivateRouteShell>
      <SettingsScreen />
    </PrivateRouteShell>
  );
}
