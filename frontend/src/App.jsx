import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Importações dos seus componentes existentes
import { Splash } from "./pages/Splash";
import { Login } from "./pages/Login";
import { Calouro } from "./pages/Calouro";
import { Cadastro } from "./pages/Cadastro";
import { Home } from "./pages/Home";
import { Rota } from "./pages/Rota";
import { Favoritos } from "./pages/Favoritos";
import SearchResults from "./pages/SearchResults";
import Admin from "./pages/Admin";

const isAuthenticated = true; // Simulação da sua variável de autenticação

function PrivateRoute({ children }) {
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <BrowserRouter>
      {" "}
      <Routes>
        {/* Rotas Públicas */}
        <Route path="/" element={<Splash />} />
        {/* Rotas Principais */}
        <Route path="/busca" element={<Home />} />
        <Route path="/results/:destinoSel" element={<SearchResults />} />
        <Route path="/rota/:destinoId" element={<Rota />} />{" "}
        {/* Rotas Protegidas */}
        <Route path="/admin" element={<Admin />} />
        <Route
          path="/favoritos"
          element={
            <PrivateRoute>
              <Favoritos />{" "}
            </PrivateRoute>
          }
        />{" "}
      </Routes>{" "}
    </BrowserRouter>
  );
}

export default App;
