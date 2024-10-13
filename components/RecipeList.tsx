import React, { useCallback, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Pen, Trash } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import useRecipeStore, { Recipe } from "@/stores/recipeStore";
import { useTranslations } from "next-intl";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { toast } from "@/hooks/use-toast";

function RecipeItem({
  recipe,
  remove,
}: {
  recipe: Recipe;
  remove: (id: string) => Promise<void>;
}) {
  const t = useTranslations("RecipeItem");
  const router = useRouter();
  const { userId } = useAuth();

  function edit() {
    router.push(`/${userId}/recipe/${recipe.id}`);
  }

  return (
    <Card className="xl:col-span-2" x-chunk="dashboard-01-chunk-4">
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
          <CardTitle>{recipe.name}</CardTitle>
        </div>
        <div className="ml-auto flex gap-2">
          <Button variant="ghost" size="icon" className="gap-1" onClick={edit}>
            <Pen className="size-4" />
            <span className="sr-only">Pen</span>
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" className="gap-1">
                <Trash className="size-4" />
                <span className="sr-only">Trash</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t("deletedTitle")}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t("deletedDescription")}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => (recipe.id ? remove(recipe.id) : undefined)}
                >
                  {t("continue")}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("ingredient")}</TableHead>
              <TableHead className="text-right">{t("amount")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recipe.ingredients.map((ingredient, idx) => (
              <TableRow key={idx}>
                <TableCell>
                  <div className="font-medium">{ingredient.name}</div>
                </TableCell>
                <TableCell className="text-right">
                  {ingredient.quantity}{" "}
                  {ingredient.unit === "ml"
                    ? ingredient.unit
                    : ingredient.quantity
                      ? ingredient.quantity > 1
                        ? ingredient.unit + "s"
                        : ingredient.unit
                      : ""}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default function RecipeList() {
  const { recipes, setRecipes, setLoading, setError, loading, error } =
    useRecipeStore();

  const fetchRecipes = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/recipes");
      if (!response.ok) {
        throw new Error("Failed to fetch recipes");
      }
      const data = await response.json();
      setRecipes(data);
    } catch (error: unknown) {
      // Check if the error is an instance of Error
      if (error instanceof Error) {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  }, [setError, setLoading, setRecipes]);

  const remove = async (id: string) => {
    try {
      const response = await fetch(`/api/recipes/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete recipe: ${response.statusText}`);
      }

      toast({
        title: "Recipe Deleted",
        description: "The recipe has been successfully deleted.",
      });

      // Call fetchRecipes to refresh the recipe list
      fetchRecipes();
    } catch (error: unknown) {
      // Check if the error is an instance of Error
      if (error instanceof Error) {
        toast({
          title: "Error",
          description: error.message || "Failed to delete the recipe.",
          variant: "destructive",
        });
      }
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      {recipes.map((recipe, index) => (
        <div key={index}>
          <RecipeItem {...{ recipe, remove }} />
        </div>
      ))}
    </div>
  );
}
