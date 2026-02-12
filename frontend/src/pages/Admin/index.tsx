import { useState } from "react";
import { images } from "../../Repositories/images";
import { StepsModel, steps } from "../../Repositories/steps";
import { rotas } from "../../Repositories/rotas";
import styles from "./Admin.module.css";

const Admin = () => {
  const [routeName, setRouteName] = useState("");
  const [stepsList, setSteps] = useState<StepsModel[]>([]);
  const [creatingStep, setCreatingStep] = useState(false);
  const [routeSteps, setRouteSteps] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState<StepsModel>({
    description: "",
    image: "",
  });

  const handleCreatingStep = async () => {
    if (!formData.description || !formData.image) {
      alert("Preencha todos os campos da etapa!");
      return;
    }

    const data = await steps.addNewStep(formData);
    setSteps([...stepsList, formData]);
    setRouteSteps([...routeSteps, data[0].id]);

    setFormData({ description: "", image: "" });
    setCreatingStep(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const url = await images.uploadImage(file);
    if (url) {
      setFormData((prev) => ({ ...prev, image: url }));
    }
    setIsUploading(false);
  };

  const createRoute = () => {
    rotas.addNewRoute({
      name: routeName,
      steps: routeSteps,
    });
    alert("Rota publicada!");
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Painel do Administrador</h1>

      <section className={styles.routeSection}>
        <label className={styles.label}>Nome da Rota Principal</label>
        <input
          className={styles.input}
          type="text"
          placeholder="Digite o nome do destino final..."
          value={routeName}
          onChange={(e) => setRouteName(e.target.value)}
        />
      </section>

      <section className={styles.stepsSection}>
        <header className={styles.header}>
          <h3>Etapas ({stepsList.length})</h3>
          {!creatingStep && (
            <button
              className={styles.btnPrimary}
              onClick={() => setCreatingStep(true)}
            >
              + Adicionar Etapa
            </button>
          )}
        </header>

        {creatingStep && (
          <div className={styles.stepForm}>
            <h4>Nova Etapa</h4>

            <div>
              <label className={styles.label}>Foto do Local</label>

              {/* ÁREA DE PREVIEW DA IMAGEM */}
              <div className={styles.imagePreviewContainer}>
                {isUploading ? (
                  <div className={styles.uploadPlaceholder}>
                    Enviando para o servidor...
                  </div>
                ) : formData.image ? (
                  <img
                    src={formData.image}
                    alt="Preview do upload"
                    className={styles.imagePreview}
                  />
                ) : (
                  <div className={styles.uploadPlaceholder}>
                    Nenhuma imagem selecionada
                  </div>
                )}
              </div>

              <input
                type="file"
                onChange={handleFileChange}
                accept="image/*" // Garante que apenas imagens apareçam na seleção
                style={{ marginTop: "10px" }}
              />
              {isUploading && (
                <p style={{ color: "blue", fontSize: "12px" }}>
                  Aguarde o processamento...
                </p>
              )}
            </div>

            <div>
              <label className={styles.label}>Descrição</label>
              <input
                className={styles.input}
                name="description"
                type="text"
                placeholder="Descreva este ponto da rota"
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                className={styles.btnSave}
                onClick={handleCreatingStep}
                disabled={isUploading || !formData.image} // Desabilita se não tiver imagem
              >
                Salvar Etapa
              </button>
              <button
                className={styles.btnCancel}
                onClick={() => setCreatingStep(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        <ul className={styles.stepsList}>
          {stepsList.map((step, index) => (
            <li key={index} className={styles.stepItem}>
              <span className={styles.badge}>{index + 1}</span>
              <img
                src={step.image}
                alt="Preview"
                className={styles.previewImg}
              />
              <span>{step.description}</span>
            </li>
          ))}
        </ul>
      </section>

      <button
        className={styles.btnPublish}
        onClick={createRoute}
        disabled={stepsList.length === 0 || !routeName}
      >
        PUBLICAR ROTA COMPLETA
      </button>
    </div>
  );
};

export default Admin;
