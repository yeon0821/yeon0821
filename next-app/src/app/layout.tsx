import type { Metadata } from "next";
import "@/styles/globals.css";
import Providers from "./providers";
import Navbar from "@/components/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const metadata: Metadata = {
  title: "Nextmap",
  description: "맛집 지도 서비스",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <Providers>
          <div className="layout">
            <Navbar />
            {children}
            <ToastContainer
              autoClose={1000}
              pauseOnFocusLoss={false}
              pauseOnHover={false}
            />
          </div>
        </Providers>
      </body>
    </html>
  );
}
