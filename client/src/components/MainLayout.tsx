import { Outlet } from "react-router-dom";
import NavbarComponent from "./Navbar";

export default function MainLayout() {
  return (
    <>
      <NavbarComponent />
      <main>
        <Outlet />
      </main>
    </>
  );
}
