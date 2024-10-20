import { Unit } from "@/types";
import { create } from "zustand";

export type Ingredient = {
  id?: string;
  name?: string;
  quantity?: number;
  unit?: Unit;
  createdBy?: string;
};

export type FetchIngredientsResponse = Ingredient[];
export type AddIngredientPayload = Omit<Ingredient, "id">;
export type UpdateIngredientPayload = Ingredient;

type IngredientStore = {
  ingredients: Ingredient[];
  loading: boolean;
  error: string | null;
  fetchIngredients: (userId?: string) => Promise<FetchIngredientsResponse>;
  fetchIngredient: (id: string) => Promise<Ingredient | null>;
  addIngredient: (ingredient: AddIngredientPayload) => Promise<void>;
  editIngredient: (
    id: string,
    updatedIngredient: UpdateIngredientPayload,
  ) => Promise<void>;
  removeIngredient: (id: string) => Promise<void>;
  setIngredients: (ingredients: Ingredient[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
};

const useIngredientStore = create<IngredientStore>((set) => ({
  ingredients: [],
  loading: true,
  error: null,

  fetchIngredients: async (userId) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(
        userId ? `/api/ingredients?userId=${userId}` : "/api/ingredients",
      );
      const data: FetchIngredientsResponse = await response.json();
      set({ ingredients: data });
      return data; // Return the fetched ingredients
    } catch (error: unknown) {
      set({ error: (error as Error).message });
      return []; // Return an empty array on error
    } finally {
      set({ loading: false }); // Always set loading to false
    }
  },

  fetchIngredient: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`/api/ingredients/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch ingredient");
      }

      const ingredient = await response.json();
      return ingredient;
    } catch (error: unknown) {
      set({ error: (error as Error).message });
      return null; // Return null if there's an error fetching the ingredient
    } finally {
      set({ loading: false }); // Always set loading to false
    }
  },

  addIngredient: async (ingredient: AddIngredientPayload) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("/api/ingredients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ingredient),
      });

      if (!response.ok) {
        throw new Error("Failed to add ingredient");
      }

      // Refetch the ingredients list to get the updated data
      await useIngredientStore.getState().fetchIngredients();
    } catch (error: unknown) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false }); // Always set loading to false
    }
  },

  editIngredient: async (
    id: string,
    updatedIngredient: UpdateIngredientPayload,
  ) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`/api/ingredients/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedIngredient),
      });

      if (!response.ok) {
        throw new Error("Failed to edit ingredient");
      }

      // Refetch the ingredients list to get the updated data
      await useIngredientStore.getState().fetchIngredients();
    } catch (error: unknown) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false }); // Always set loading to false
    }
  },

  removeIngredient: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`/api/ingredients/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to remove ingredient");
      }

      // Refetch the ingredients list to get the updated data
      await useIngredientStore.getState().fetchIngredients();
    } catch (error: unknown) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false }); // Always set loading to false
    }
  },

  setIngredients: (ingredients: Ingredient[]) => set({ ingredients }),
  setLoading: (loading: boolean) => set({ loading }),
  setError: (error: string | null) => set({ error }),
}));

export default useIngredientStore;
