import { create } from "zustand";

export type Ingredient = {
  id?: string;
  name: string;
  quantity?: number;
  unit?: string;
  createdBy?: string;
};

type IngredientStore = {
  ingredients: Ingredient[];
  loading: boolean;
  error: string | null;
  addIngredient: (ingredient: Ingredient) => void;
  setIngredients: (ingredients: Ingredient[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
};

const useIngredientStore = create<IngredientStore>((set) => ({
  ingredients: [],
  loading: false,
  error: null,
  addIngredient: (ingredient: Ingredient) =>
    set((state) => ({
      ingredients: [...state.ingredients, ingredient],
    })),
  setIngredients: (ingredients: Ingredient[]) => set({ ingredients }),
  setLoading: (loading: boolean) => set({ loading }),
  setError: (error: string | null) => set({ error }),
}));

export default useIngredientStore;