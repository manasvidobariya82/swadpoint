import Header from "../../components/ui/Header";

export default function LoginLayout({ children }) {
  return (
    <div className="h-screen bg-gray-100">
      {/* SIDEBAR */}
      <Header isAuthenticated={false} />

      {/* PAGE CONTENT */}
      <main className="overflow-y-auto">{children}</main>
    </div>
  );
}