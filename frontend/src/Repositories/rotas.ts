import { supabase } from "../Config/supabase";

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
};
