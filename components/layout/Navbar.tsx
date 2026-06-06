import { AuthNavActions, UserNavActions } from "@/components/layout/AuthNavActions";
import { NavbarClient } from "@/components/layout/NavbarClient";

export function Navbar() {
  return (
    <NavbarClient
      authActions={<AuthNavActions />}
      userMenu={<UserNavActions />}
    />
  );
}
