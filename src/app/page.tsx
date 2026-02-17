import HomeRedirect from "@/components/auth/HomeRedirect";

export const dynamic = "force-static";
export const revalidate = false;

export default function Page() {
  return <HomeRedirect />;
}
