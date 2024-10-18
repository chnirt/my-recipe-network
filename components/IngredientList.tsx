import { useEffect } from "react";
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
import { Unit } from "@/types";

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
  const { ingredients, loading, error, fetchIngredients, removeIngredient } =
    useIngredientStore();
  const t = useTranslations();

  useEffect(() => {
    fetchIngredients();
  }, [fetchIngredients]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

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
                          (valueItem) => valueItem.id === ingredient.id,
                        )?.quantity ?? "")
                      : ""
                  }
                  onChange={
                    typeof onChange === "function"
                      ? (e) => {
                          let ingredients = value;

                          const id = ingredient.id;
                          const quantity = Number(e.target.value);
                          const unit: Unit = "ml";

                          const newIngredient = {
                            id,
                            quantity,
                            unit,
                          };

                          const existingIngredientIndex = value.findIndex(
                            (ing) => ing.id === ingredient.id,
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
                          (valueItem) => valueItem.id === ingredient.id,
                        )?.unit ?? undefined)
                      : undefined
                  }
                  onValueChange={(unit: Unit) => {
                    let ingredients = value;

                    const id = ingredient.id;
                    const quantity = 1;

                    const newIngredient = {
                      id,
                      quantity,
                      unit,
                    };

                    const existingIngredientIndex = value.findIndex(
                      (ing) => ing.id === ingredient.id,
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
                    <SelectValue placeholder={t("IngredientList.selectUnit")} />
                  </SelectTrigger>
                  <SelectContent>
                    {UnitArray.map((unit, ui) => (
                      <SelectItem key={["unit", ui].join("-")} value={unit}>
                        {t(`Units.${unit}`)}
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
                      <AlertDialogTitle>
                        {t("IngredientList.deletedTitle")}
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        {t("IngredientList.deletedDescription")}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>
                        {t("IngredientList.cancel")}
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() =>
                          ingredient.id
                            ? removeIngredient(ingredient.id)
                            : undefined
                        }
                      >
                        {t("IngredientList.continue")}
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
