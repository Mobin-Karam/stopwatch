import { notFound } from "next/navigation";
import ClientHome from "../ClientHome";
import { NAV_ITEMS } from "../../config/pages";
import type { PageKey } from "../../types/navigation";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return NAV_ITEMS.map((item) => ({ page: item.key }));
}

export default function Page({ params }: { params: { page: string } }) {
  const key = params.page as PageKey;
  const isSupported = NAV_ITEMS.some((item) => item.key === key);

  if (!isSupported) {
    notFound();
  }

  return <ClientHome initialPage={key} />;
}
