import { useState } from "react";
import { Search, Plus, X, Trash2 } from "lucide-react";
import { images } from "../../Repositories/images";
import { StepsModel, steps } from "../../Repositories/steps";
import { rotas } from "../../Repositories/rotas";
import styles from "./Admin.module.css";

interface StepWithId extends StepsModel {
  id: string;
}

const Admin = () => {
  const [routeName, setRouteName] = useState("");
  const [stepsList, setStepsList] = useState<StepWithId[]>([]);
  const [routeStepsIds, setRouteStepsIds] = useState<string[]>([]);

  const [creatingStep, setCreatingStep] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<StepWithId[]>([]);

  const [formData, setFormData] = useState<StepsModel>({
    description: "",
    image: "",
  });

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

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.length > 2) {
      const { data, error } = await steps.listByDescription(value);
      if (error) {
        console.error(error);
        setSearchResults([]);
        return;
      }
      setSearchResults(data || []);
    } else {
      setSearchResults([]);
    }
  };

  const handleAddExistingStep = (step: StepWithId) => {
    setStepsList([...stepsList, step]);
    setRouteStepsIds([...routeStepsIds, step.id]);
    setShowSearch(false);
    setSearchTerm("");
  };

  const handleCreatingStep = async () => {
    if (!formData.description || !formData.image) {
      alert("Preencha todos os campos da etapa!");
      return;
    }

    try {
      const data = await steps.addNewStep(formData);
      const newStepId = data[0].id;
      const newStepComplete: StepWithId = { ...formData, id: newStepId };

      setStepsList([...stepsList, newStepComplete]);
      setRouteStepsIds([...routeStepsIds, newStepId]);
      setFormData({ description: "", image: "" });
      setCreatingStep(false);
    } catch (error) {
      alert("Erro ao salvar nova etapa.");
    }
  };

  const handleRemoveStep = (indexToRemove: number) => {
    setStepsList(stepsList.filter((_, index) => index !== indexToRemove));
    setRouteStepsIds(
      routeStepsIds.filter((_, index) => index !== indexToRemove),
    );
  };

  const createRoute = async () => {
    try {
      await rotas.addNewRoute({
        name: routeName,
        steps: routeStepsIds,
      });
      alert("Rota publicada com sucesso!");
      setRouteName("");
      setStepsList([]);
      setRouteStepsIds([]);
    } catch (error) {
      alert("Erro ao publicar rota.");
    }
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
          <div className={styles.headerActions}>
            {!creatingStep && !showSearch && (
              <>
                <button
                  className={styles.btnSecondary}
                  onClick={() => setShowSearch(true)}
                >
                  <Search size={18} /> Buscar Existente
                </button>
                <button
                  className={styles.btnPrimary}
                  onClick={() => setCreatingStep(true)}
                >
                  <Plus size={18} /> Nova Etapa
                </button>
              </>
            )}
          </div>
        </header>

        {/* BUSCA DE ETAPA */}
        {showSearch && (
          <div className={styles.searchBox}>
            <div className={styles.searchHeader}>
              <h4>Buscar Etapa no Banco</h4>
              <button
                onClick={() => setShowSearch(false)}
                className={styles.btnClose}
              >
                <X size={20} />
              </button>
            </div>
            <input
              className={styles.input}
              type="text"
              placeholder="Digite a descrição da etapa..."
              value={searchTerm}
              onChange={handleSearch}
              autoFocus
            />
            <div className={styles.searchResults}>
              {searchResults.map((step) => (
                <div
                  key={step.id}
                  className={styles.searchItem}
                  onClick={() => handleAddExistingStep(step)}
                >
                  <img src={step.image} alt="" className={styles.miniImg} />
                  <span className={styles.searchDesc}>{step.description}</span>
                  <Plus size={16} color="#FFB300" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CRIAÇÃO DE NOVA ETAPA */}
        {creatingStep && (
          <div className={styles.stepForm}>
            <h4>Nova Etapa</h4>

            <div className={styles.imageUploadSection}>
              <label className={styles.label}>Foto do Local</label>
              <div className={styles.imagePreviewContainerLarge}>
                {isUploading ? (
                  <div className={styles.uploadPlaceholder}>
                    Enviando para o servidor...
                  </div>
                ) : formData.image ? (
                  <img
                    src={formData.image}
                    alt="Preview"
                    className={styles.imagePreviewLarge}
                  />
                ) : (
                  <div className={styles.uploadPlaceholder}>
                    Nenhuma imagem selecionada
                  </div>
                )}
              </div>
              <input type="file" onChange={handleFileChange} accept="image/*" />
            </div>

            <div className={styles.inputGroup}>
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

            <div className={styles.formButtons}>
              <button
                className={styles.btnSave}
                onClick={handleCreatingStep}
                disabled={isUploading || !formData.image}
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

        {/* LISTAGEM DAS ETAPAS DA ROTA ATUAL */}
        <ul className={styles.stepsList}>
          {stepsList.map((step, index) => (
            <li key={`${step.id}-${index}`} className={styles.stepItem}>
              <span className={styles.badge}>{index + 1}</span>
              <div className={styles.imageContainer}>
                <img
                  src={step.image}
                  alt={`Passo ${index + 1}`}
                  className={styles.previewImgLarge}
                />
              </div>
              <div className={styles.stepContent}>
                <span className={styles.stepDescription}>
                  {step.description}
                </span>
              </div>
              <button
                className={styles.btnDelete}
                onClick={() => handleRemoveStep(index)}
              >
                <Trash2 size={20} color="#ff4444" />
              </button>
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
