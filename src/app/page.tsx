import ClientHome from "./ClientHome";

export const dynamic = "force-static";
export const revalidate = false;

export default function Page() {
  return <ClientHome initialPage="stopwatch" />;
}
