import Header from "../components/ui/Header";
import "./globals.css";

export default function DashboardLayout({ children }) {
  return (
    <>
      <html>
        <body>{children}</body>
      </html>
    </>
  );
}
