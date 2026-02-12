import { supabase } from "../Config/supabase";

export interface RouteModel {
  name: string;
  steps: string[];
}

export const rotas = {
  async listByName(name: string) {
    const { data, error } = await supabase
      .from("rotas")
      .select("*")
      .ilike("name", `%${name}%`);
    if (error) throw error;
    return data;
  },

  async listById(id: string) {
    const { data, error } = await supabase
      .from("rotas")
      .select()
      .eq("id", `${id}`);
    if (error) throw error;
    return data;
  },

  async addNewRoute(route: RouteModel) {
    const { data, error } = await supabase.from("rotas").insert(route).select();
    if (error) throw error;
    return data;
  },
};
