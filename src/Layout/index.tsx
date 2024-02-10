import { PropsWithChildren } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";


interface LayoutProps extends PropsWithChildren<object> {
  // Other props specific to your component
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="bg-slate-800 w-full h-dvh flex items-center justify-center">
      <Header />
      {children}
      <Footer />
    </div>
  );
}
