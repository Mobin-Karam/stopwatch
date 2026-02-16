import { useMemo, useState } from "react";
import type { NavItem, PageKey } from "../types/navigation";

type UseNavigationOptions = {
  items: NavItem[];
  initialPage?: PageKey;
};

export const useNavigation = ({ items, initialPage = items[0]?.key }: UseNavigationOptions) => {
  const [activePage, setActivePage] = useState<PageKey>(initialPage ?? "stopwatch");

  const activeNav = useMemo(
    () => items.find((item) => item.key === activePage) ?? items[0],
    [activePage, items],
  );

  return { activePage, setActivePage, activeNav };
};
