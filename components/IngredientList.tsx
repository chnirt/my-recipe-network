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
import NumberInput from "./NumberInput";

const columns = ["Ingredient", "Quantity", "Unit"];

const IngredientList = ({
  defaultValue,
  value = [],
  onChange,
  onIngredientClick,
}: {
  defaultValue: Ingredient[];
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
        ingredients
          .map((ingredient) => {
            const unit = defaultValue.find((v) => v.id === ingredient.id);
            return { ...ingredient, unit };
          })
          .sort((a, b) => {
            const hasValueA = !!a.unit; // Check if a has a unit
            const hasValueB = !!b.unit; // Check if b has a unit

            // Compare based on unit
            if (hasValueA && !hasValueB) return -1; // A has unit, B does not
            if (!hasValueA && hasValueB) return 1; // A does not have unit, B has

            // Check if a.name and b.name exist
            const nameA = a.name ? a.name.toLowerCase() : ""; // If not, assign an empty string
            const nameB = b.name ? b.name.toLowerCase() : ""; // If not, assign an empty string

            // Sort by name
            if (nameA < nameB) return -1;
            if (nameA > nameB) return 1;
            return 0;
          })
          .map((ingredient, ii) => {
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
                  <NumberInput
                    value={
                      value.length > 0
                        ? (value.find(
                            (valueItem) => valueItem.id === ingredient.id,
                          )?.quantity ?? 0)
                        : 0
                    }
                    onChange={(number) => {
                      let ingredients = value;

                      const id = ingredient.id;
                      const quantity = Number(number);
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
                      if (typeof onChange === "function") {
                        onChange(ingredients);
                      }
                    }}
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
                      <SelectValue
                        placeholder={t("IngredientList.selectUnit")}
                      />
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
