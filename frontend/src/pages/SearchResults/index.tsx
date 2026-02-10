import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { MapPinCheck } from "lucide-react";
import styles from "./SearchResults.module.css";

import logoSalaCerta from "../../assets/sc.png";
import logoFliche from "../../assets/flxche.png";
import { rotas } from "../../Repositories/rotas";
import Loading from "../../components/Loading";

interface Rota {
  id: number;
  name: string;
  steps: string[];
  faculdade: number;
}

const SearchResults = () => {
  const navigate = useNavigate();
  const { destinoSel } = useParams();
  const [results, setResults] = useState<Rota[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const findResults = async () => {
      if (destinoSel) {
        try {
          const result = await rotas.listByName(destinoSel);
          setResults(result);
        } catch (error) {
          console.error("Erro ao buscar rotas:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    findResults();
  }, [destinoSel]);

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <div className={styles.container}>
          <img src={logoSalaCerta} alt="Logo" className={styles.headerLogo} />

          <div className={styles.saudacao}>
            <p className={styles.subtitulo}>Resultados encontrados...</p>
          </div>

          <div className={styles.lista}>
            {results.length === 0 ? (
              <p style={{ textAlign: "center", color: "#999" }}>
                Nenhuma rota encontrada com "{destinoSel}"
              </p>
            ) : (
              results.map((rota) => (
                <div
                  key={rota.id}
                  className={styles.card}
                  onClick={() => navigate(`/rota/${rota.id}`)}
                >
                  <div className={styles.cardInfo}>
                    <MapPinCheck size={24} color="#FFB300" fill="#fff" />
                    {/* Corrigido de textoSota para textoSala se necessário */}
                    <span className={styles.textoSala}>{rota.name}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className={styles.areaBusca}>
            <p className={styles.textoBusca}>Deseja procurar por outra sala?</p>
            <button
              className={styles.btnEncontre}
              onClick={() => navigate("/busca")}
            >
              Encontre aqui
            </button>
          </div>

          <img src={logoFliche} alt="Fliche" className={styles.footerLogo} />
        </div>
      )}
    </>
  );
};

export default SearchResults;
