import { supabase } from "../Config/supabase";
export interface StepsModel {
  image: string;
  description: string;
}
export const steps = {
  async listarTodos() {
    const { data, error } = await supabase.from("steps").select("*");
    if (error) throw error;
    return data;
  },
  async listByArrayIds(ids: string[]) {
    const { data, error } = await supabase
      .from("steps")
      .select("*")
      .in("id", ids);
    if (error) throw error;
    return data;
  },
  async addNewStep(step: StepsModel) {
    const { data, error } = await supabase.from("steps").insert(step).select();
    if (error) throw error;
    return data;
  },

  async listByDescription(description: string) {
    const data = await supabase
      .from("steps")
      .select("*")
      .ilike("description", `%${description}%`);

    return data;
  },
};
