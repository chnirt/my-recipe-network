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

const IngredientList = ({
  value = [],
  onChange,
}: {
  value: Ingredient[];
  onChange: Function;
}) => {
  const { ingredients, setIngredients, setLoading, setError } =
    useIngredientStore();

  useEffect(() => {
    const fetchIngredients = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/ingredients");
        if (!response.ok) {
          throw new Error("Failed to fetch ingredients");
        }
        const data = await response.json();
        setIngredients(data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchIngredients();
  }, [setIngredients, setLoading, setError]);

  return (
    <>
      {ingredients.length > 0
        ? ingredients.map((ingredient, ii) => {
            return (
              <TableRow key={["ingredient", ii].join("-")}>
                <TableCell className="font-semibold">
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
                                unit,
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
                  <Select defaultValue={UnitArray[0]}>
                    <SelectTrigger id="unit" aria-label="Select unit">
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      {UnitArray.map((unit, ui) => (
                        <SelectItem key={["unit", ui].join("-")} value={unit}>
                          {unit}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            );
          })
        : null}
    </>
  );
};

export default IngredientList;
