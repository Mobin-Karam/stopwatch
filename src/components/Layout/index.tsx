import { PropsWithChildren } from "react";
import Footer from "../Footer";
import Header from "../Header";

interface LayoutProps extends PropsWithChildren<object> {
  // Other props specific to your component
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="bg-slate-600 w-full h-dvh flex items-center justify-center">
      <Header />
      {children}
      <Footer />
    </div>
  );
}
