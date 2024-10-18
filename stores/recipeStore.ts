import { create } from "zustand";
import { Ingredient } from "./ingredientStore";
import useIngredientStore from "./ingredientStore"; // Import the ingredient store

export type Recipe = {
  id?: string;
  name: string;
  note?: string;
  ingredients: Ingredient[];
};

// Define the type for the final mapped recipe
export type MappedRecipe = Omit<Recipe, "ingredients"> & {
  ingredients: Array<{
    id: string;
    name: string;
    quantity: number;
  }>;
};

// Define the type for fetching recipes
export type FetchRecipesResponse = Recipe[];

// Define the type for adding a recipe (excluding id)
export type AddRecipePayload = Omit<Recipe, "id">;

// Define the type for editing a recipe
export type EditRecipePayload = Recipe;

type RecipeStore = {
  recipes: Recipe[];
  mappedRecipes: MappedRecipe[];
  loading: boolean;
  error: string | null;
  fetchRecipes: (name?: string) => Promise<FetchRecipesResponse>;
  fetchRecipesWithIngredients: () => Promise<void>;
  fetchRecipe: (id: string) => Promise<Recipe | null>;
  addRecipe: (recipe: AddRecipePayload) => Promise<void>;
  editRecipe: (id: string, updatedRecipe: EditRecipePayload) => Promise<void>;
  removeRecipe: (id: string) => Promise<void>;
  setRecipes: (recipes: Recipe[]) => void;
  setMappedRecipes: (recipes: MappedRecipe[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
};

const useRecipeStore = create<RecipeStore>((set) => ({
  recipes: [],
  mappedRecipes: [],
  loading: false,
  error: null,

  // Fetch all recipes from the API, optionally filtered by name
  fetchRecipes: async (searchName?: string) => {
    set({ loading: true, error: null });
    try {
      // Include the search name in the query parameters
      const query = searchName
        ? `?search=${encodeURIComponent(searchName)}`
        : "";
      const response = await fetch(`/api/recipes${query}`);
      const data: FetchRecipesResponse = await response.json();

      set({ recipes: data });
      return data; // Return fetched recipes
    } catch (error: unknown) {
      set({ error: (error as Error).message });
      return []; // Return empty array on error
    } finally {
      set({ loading: false }); // Always set loading to false
    }
  },

  // Fetch both recipes and ingredients, then map them
  fetchRecipesWithIngredients: async () => {
    set({ loading: true, error: null });
    try {
      // Fetch both recipes and ingredients
      const fetchRecipesPromise = fetch("/api/recipes");
      const fetchIngredientsPromise = useIngredientStore
        .getState()
        .fetchIngredients();

      const [recipesResponse, ingredientsResponse] = await Promise.all([
        fetchRecipesPromise,
        fetchIngredientsPromise,
      ]);

      const recipes = await recipesResponse.json();
      const ingredients = useIngredientStore.getState().ingredients;

      // Map ingredients into recipes
      const mappedRecipes = recipes.map((recipe: Recipe) => {
        const mappedIngredients = recipe.ingredients.map((ingredient) => {
          const ingredientData = ingredients.find(
            (ing) => ing.id === ingredient.id,
          );
          return {
            id: ingredient.id,
            name: ingredientData ? ingredientData.name : "Unknown ingredient",
            quantity: ingredient.quantity,
            unit: ingredient.unit,
          };
        });
        return { ...recipe, ingredients: mappedIngredients };
      });

      set({ recipes, mappedRecipes });
    } catch (error: unknown) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  // Fetch a single recipe by ID
  fetchRecipe: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`/api/recipes/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch recipe");
      }

      const recipe = await response.json();
      return recipe;
    } catch (error: unknown) {
      set({ error: (error as Error).message });
      return null; // Return null if there's an error fetching the recipe
    } finally {
      set({ loading: false }); // Always set loading to false
    }
  },

  // Add a new recipe by calling the API and refetch the recipes list
  addRecipe: async (recipe: AddRecipePayload) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("/api/recipes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(recipe),
      });

      if (!response.ok) {
        throw new Error("Failed to add recipe");
      }

      // Refetch the recipes list to get the updated data
      await useRecipeStore.getState().fetchRecipes();
    } catch (error: unknown) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false }); // Always set loading to false
    }
  },

  // Edit an existing recipe by calling the API
  editRecipe: async (id: string, updatedRecipe: EditRecipePayload) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`/api/recipes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedRecipe),
      });

      if (!response.ok) {
        throw new Error("Failed to edit recipe");
      }

      // Refetch the recipes list to get the updated data
      await useRecipeStore.getState().fetchRecipes();
    } catch (error: unknown) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false }); // Always set loading to false
    }
  },

  // Remove a recipe by calling the API and refetch the recipes list
  removeRecipe: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`/api/recipes/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to remove recipe");
      }

      // Refetch the recipes list to get the updated data
      await useRecipeStore.getState().fetchRecipes();
    } catch (error: unknown) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false }); // Always set loading to false
    }
  },

  // Setters
  setRecipes: (recipes: Recipe[]) => set({ recipes }),
  setMappedRecipes: (recipes: MappedRecipe[]) =>
    set({ mappedRecipes: recipes }),
  setLoading: (loading: boolean) => set({ loading }),
  setError: (error: string | null) => set({ error }),
}));

export default useRecipeStore;
