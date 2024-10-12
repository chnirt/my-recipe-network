import { create } from "zustand";
import { Ingredient } from "./ingredientStore";

export interface Recipe {
  id?: string;
  name: string;
  ingredients: Ingredient[];
  createdBy?: string;
}

type RecipeStore = {
  recipes: Recipe[];
  loading: boolean;
  error: string | null;
  addRecipe: (recipe: Recipe) => void;
  setRecipes: (recipes: Recipe[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
};

const useRecipeStore = create<RecipeStore>((set) => ({
  recipes: [],
  loading: false,
  error: null,
  addRecipe: (recipe: Recipe) =>
    set((state) => ({
      recipes: [...state.recipes, recipe],
    })),
  setRecipes: (recipes: Recipe[]) => set({ recipes }),
  setLoading: (loading: boolean) => set({ loading }),
  setError: (error: string | null) => set({ error }),
}));

export default useRecipeStore;
