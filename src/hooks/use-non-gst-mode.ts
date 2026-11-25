import { useEffect, useState } from "react";
import { getStoredUser, isNonGstMode, type AuthUser } from "@/lib/api";

/** Reactive Non-GST Mode flag for header/profile/sales UI. */
export function useNonGstMode() {
  const [user, setUser] = useState<AuthUser | null>(() =>
    typeof window === "undefined" ? null : getStoredUser(),
  );
  const [active, setActive] = useState(() =>
    typeof window === "undefined" ? false : isNonGstMode(),
  );

  useEffect(() => {
    const sync = () => {
      setUser(getStoredUser());
      setActive(isNonGstMode());
    };
    sync();
    window.addEventListener("zs_auth_changed", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("zs_auth_changed", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return {
    user,
    isSuperuser: Boolean(user?.is_superuser),
    nonGstMode: active,
  };
}
