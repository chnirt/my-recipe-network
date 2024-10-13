import { useCallback, useEffect } from "react";
import useIngredientStore, { Ingredient } from "@/stores/ingredientStore";
import { TableCell, TableRow } from "./ui/table";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { UnitArray } from "@/data/recipes";
import { useTranslations } from "next-intl";
import { Button } from "./ui/button";
import { Trash } from "lucide-react";
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

const columns = ["Ingredient", "Quantity", "Unit"];

const IngredientList = ({
  value = [],
  onChange,
  onIngredientClick,
}: {
  value: Ingredient[];
  onChange: (ingredients: Ingredient[]) => void;
  onIngredientClick: (id: string) => void;
}) => {
  const {
    ingredients,
    setIngredients,
    // setLoading, setError,
    loading,
    error,
  } = useIngredientStore();
  const t = useTranslations("IngredientList");
  const unitsT = useTranslations("Units");

  const fetchIngredients = useCallback(async () => {
    // setLoading(true);
    try {
      const response = await fetch("/api/ingredients");
      if (!response.ok) {
        throw new Error("Failed to fetch ingredients");
      }
      const data = await response.json();
      setIngredients(data);
    } catch (error: unknown) {
      // Check if the error is an instance of Error
      if (error instanceof Error) {
        // setError(error.message);
      }
    } finally {
      // setLoading(false);
    }
  }, [setIngredients]);

  const remove = async (id: string) => {
    try {
      const response = await fetch(`/api/ingredients/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete ingredient: ${response.statusText}`);
      }

      toast({
        title: "Ingredient Deleted",
        description: "The ingredient has been successfully deleted.",
      });

      // Refetch the ingredients to update the list
      fetchIngredients();
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast({
          title: "Error",
          description: error.message || "Failed to delete the ingredient.",
          variant: "destructive",
        });
      }
    }
  };

  useEffect(() => {
    fetchIngredients();
  }, [fetchIngredients]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <>
      {ingredients.length > 0 ? (
        ingredients.map((ingredient, ii) => {
          return (
            <TableRow key={["ingredient", ii].join("-")}>
              <TableCell
                className="cursor-pointer font-semibold"
                onClick={() =>
                  typeof onIngredientClick === "function" && ingredient.id
                    ? onIngredientClick(ingredient.id)
                    : undefined
                }
              >
                {ingredient.name}
              </TableCell>
              <TableCell>
                <Label htmlFor="quantity-1" className="sr-only">
                  Quantity
                </Label>
                <Input
                  id="quantity-1"
                  type="number"
                  min={0}
                  value={
                    value.length > 0
                      ? (value.find(
                          (valueItem) => valueItem.name === ingredient.name,
                        )?.quantity ?? "")
                      : ""
                  }
                  onChange={
                    typeof onChange === "function"
                      ? (e) => {
                          let ingredients = value;

                          const name = ingredient.name;
                          const quantity = Number(e.target.value);
                          const unit = "ml";

                          const newIngredient = {
                            name,
                            quantity,
                            unit,
                          };

                          const existingIngredientIndex = value.findIndex(
                            (ing) => ing.name === ingredient.name,
                          );

                          if (existingIngredientIndex !== -1) {
                            const updatedIngredients = [...value];
                            updatedIngredients[existingIngredientIndex] = {
                              ...updatedIngredients[existingIngredientIndex],
                              quantity,
                            };
                            ingredients = updatedIngredients;
                          } else {
                            ingredients = [...value, newIngredient];
                          }
                          onChange(ingredients);
                        }
                      : undefined
                  }
                />
              </TableCell>
              <TableCell>
                <Select
                  value={
                    value.length > 0
                      ? (value.find(
                          (valueItem) => valueItem.name === ingredient.name,
                        )?.unit ?? undefined)
                      : undefined
                  }
                  onValueChange={(unit) => {
                    let ingredients = value;

                    const name = ingredient.name;
                    const quantity = 1;

                    const newIngredient = {
                      name,
                      quantity,
                      unit,
                    };

                    const existingIngredientIndex = value.findIndex(
                      (ing) => ing.name === ingredient.name,
                    );

                    if (existingIngredientIndex !== -1) {
                      const updatedIngredients = [...value];
                      updatedIngredients[existingIngredientIndex] = {
                        ...updatedIngredients[existingIngredientIndex],
                        unit,
                      };
                      ingredients = updatedIngredients;
                    } else {
                      ingredients = [...value, newIngredient];
                    }
                    onChange(ingredients);
                  }}
                >
                  <SelectTrigger id="unit" aria-label="Select unit">
                    <SelectValue placeholder={t("selectUnit")} />
                  </SelectTrigger>
                  <SelectContent>
                    {UnitArray.map((unit, ui) => (
                      <SelectItem key={["unit", ui].join("-")} value={unit}>
                        {unitsT(unit)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell className="text-right">
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
                        onClick={() =>
                          ingredient.id ? remove(ingredient.id) : undefined
                        }
                      >
                        {t("continue")}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          );
        })
      ) : (
        <TableRow>
          <TableCell colSpan={columns.length} className="h-24 text-center">
            No results.
          </TableCell>
        </TableRow>
      )}
    </>
  );
};

export default IngredientList;
