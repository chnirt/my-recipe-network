import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Bookmark } from "lucide-react";
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

function RecipeItem({ recipe }: { recipe: Recipe }) {
  const t = useTranslations("RecipeItem");

  return (
    <Card className="xl:col-span-2" x-chunk="dashboard-01-chunk-4">
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
          <CardTitle>{recipe.name}</CardTitle>
        </div>
        <Button variant="ghost" size="icon" className="ml-auto gap-1">
          <Bookmark className="size-4" />
          <span className="sr-only">Bookmark</span>
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("name")}</TableHead>
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

  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/recipes");
        if (!response.ok) {
          throw new Error("Failed to fetch recipes");
        }
        const data = await response.json();
        setRecipes(data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [setRecipes, setLoading, setError]);

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      <div className="flex flex-col gap-4">
        {recipes.map((recipe, index) => (
          <div key={index}>
            <RecipeItem {...{ recipe }} />
          </div>
        ))}
      </div>
    </div>
  );
}
