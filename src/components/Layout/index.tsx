import { PropsWithChildren } from "react";
import Footer from "../Footer";
import Header from "../Header";

interface LayoutProps extends PropsWithChildren<object> {
  // Other props specific to your component
}

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
