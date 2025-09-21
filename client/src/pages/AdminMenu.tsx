import MenuBar from "../components/MenuBar";

export default function AdminMenu() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200">
      <MenuBar role="admin" showPending />
    </div>
  );
}





