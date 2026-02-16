import { notFound } from "next/navigation";
import ClientHome from "../ClientHome";
import { NAV_ITEMS } from "../../config/pages";
import type { PageKey } from "../../types/navigation";

export default function Page({ params }: { params: { page: string } }) {
  const key = params.page as PageKey;
  const isSupported = NAV_ITEMS.some((item) => item.key === key);

  if (!isSupported) {
    notFound();
  }

  return <ClientHome initialPage={key} />;
}
