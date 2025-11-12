import { useEffect, useMemo, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import Home from "./pages/Home";
import MembersPage from "./pages/Members";
import AdminPage from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import { Member } from "./types/member";
import { Photo } from "./types/photo";
import { loadMembers, loadPhotos, saveMembers, savePhotos } from "./lib/storage";

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pt-24">{children}</main>
      <Footer />
    </div>
  );
};

function App() {
  const [members, setMembers] = useState<Member[]>(() => loadMembers());
  const [photos, setPhotos] = useState<Photo[]>(() => loadPhotos());

  useEffect(() => {
    saveMembers(members);
  }, [members]);

  useEffect(() => {
    savePhotos(photos);
  }, [photos]);

  const featuredPhotos = useMemo(() => photos.filter((photo) => photo.featured), [photos]);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <AppLayout>
            <Home members={members} photos={featuredPhotos.length > 0 ? featuredPhotos : photos} />
          </AppLayout>
        }
      />
      <Route
        path="/members"
        element={
          <AppLayout>
            <MembersPage members={members} />
          </AppLayout>
        }
      />
      <Route
        path="/admin/login"
        element={
          <AppLayout>
            <AdminLogin />
          </AppLayout>
        }
      />
      <Route
        path="/admin"
        element={
          <AppLayout>
            <AdminPage members={members} setMembers={setMembers} photos={photos} setPhotos={setPhotos} />
          </AppLayout>
        }
      />
    </Routes>
  );
}

export default App;
