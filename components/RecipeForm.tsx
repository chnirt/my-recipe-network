import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import IngredientForm from "@/components/IngredientForm";
import IngredientList from "@/components/IngredientList";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { useTranslations } from "next-intl";
import useRecipeStore from "@/stores/recipeStore";
import { Textarea } from "./ui/textarea";
import { Ingredient } from "@/stores/ingredientStore";

const ingredientSchema = z.object({
  id: z.string().min(1, "Id is required"),
  quantity: z
    .number()
    .nonnegative("Quantity must be greater than or equal to 0"), // Quantity must be a non-negative number
  unit: z.enum(
    [
      "ml",
      "gram",
      "tablespoon",
      "teaspoon",
      "piece",
      "slice",
      "cup",
      "pinch",
      "tablet",
      "cube",
      "fruit",
    ],
    { invalid_type_error: "Invalid unit" }, // Unit must be one of the predefined units
  ),
});

const recipeFormSchema = z.object({
  name: z
    .string()
    .min(1, "Recipe name is required") // Recipe name is required
    .max(30, "Recipe name must be at most 30 characters long"), // Max length for recipe name
  note: z
    .string()
    .max(200, "Note must be at most 200 characters long") // Max length for note
    .optional(), // Note is optional
  ingredients: z
    .array(ingredientSchema)
    .min(1, "At least one ingredient is required")
    .refine(
      (ingredients) =>
        ingredients.some((ingredient) => ingredient.quantity > 0),
      {
        message: "At least one ingredient must have a quantity greater than 0",
        path: ["ingredients"],
      },
    ),
});

const RecipeForm = ({ id }: { id?: string }) => {
  const defaultValues = {
    name: "",
    note: "",
    ingredients: [],
  };
  const router = useRouter();
  const { addRecipe, fetchRecipe, editRecipe } = useRecipeStore();
  const form = useForm<z.infer<typeof recipeFormSchema>>({
    resolver: zodResolver(recipeFormSchema),
    defaultValues,
  });
  const t = useTranslations("RecipeForm");
  const [open, setOpen] = useState(false);
  const [ingredientId, setIngredientId] = useState("");
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);

  // Fetch ingredient data if an id is provided
  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        const ingredient = await fetchRecipe(id);
        if (ingredient) {
          setIngredients(ingredient.ingredients);
          form.reset({
            name: ingredient.name,
            note: ingredient.note,
            ingredients: ingredient.ingredients,
          });
        }
      };
      fetchData();
    }
  }, [id, fetchRecipe, form]);

  function back() {
    router.back();
  }

  function cancel() {
    back();
  }

  async function onSubmit(values: z.infer<typeof recipeFormSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    // console.log("🚀 ~ onSubmit ~ values:", values);
    const name = values.name;
    const note = values.note;
    const ingredients = values.ingredients;

    try {
      const newRecipe = { name, note, ingredients };
      if (id) {
        editRecipe(id, newRecipe);
      } else {
        addRecipe(newRecipe);
      }

      form.reset(defaultValues);
      back();
    } catch (error: unknown) {
      // Check if the error is an instance of Error
      if (error instanceof Error) {
      }
    } finally {
    }
  }

  function onIngredientClick(id: string) {
    // console.log("🚀 ~ onIngredientClick ~ id:", id);
    setIngredientId(id);
    setOpen(true);
  }

  function onCancel() {
    setIngredientId("");
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid gap-4">
          <div className="flex items-center gap-4">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={back}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Button>
            <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
              {id ? t("edit") : t("new")}
            </h1>
            <div className="hidden items-center gap-2 md:ml-auto md:flex">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={cancel}
              >
                {t("discard")}
              </Button>
              <Button size="sm" type="submit">
                {id ? t("edit") : t("save")}
              </Button>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
            <div className="grid auto-rows-max items-start gap-4 lg:col-span-3 lg:gap-8">
              <Card x-chunk="dashboard-07-chunk-0">
                <CardHeader>
                  <CardTitle>{t("details")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className="grid gap-3">
                          <FormLabel>{t("name")}</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              className="w-full"
                              placeholder={t("recipeNamePlaceholder")}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="note"
                      render={({ field }) => (
                        <FormItem className="grid gap-3">
                          <FormLabel>{t("note")}</FormLabel>
                          <FormControl>
                            <Textarea
                              id="note"
                              className="min-h-24"
                              placeholder={t("recipeNotePlaceholder")}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
              <Card x-chunk="dashboard-07-chunk-1">
                <CardHeader>
                  <CardTitle>{t("ingredients")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="ingredients"
                    render={({ field }) => (
                      <FormItem className="grid gap-3">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-[100px]">
                                {t("ingredient")}
                              </TableHead>
                              <TableHead className="w-[100px]">
                                {t("quantity")}
                              </TableHead>
                              <TableHead className="w-[100px]">
                                {t("unit")}
                              </TableHead>
                              <TableHead>
                                <span className="sr-only">Actions</span>
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <IngredientList
                              {...{
                                defaultValue: ingredients,
                                ...field,
                                onIngredientClick,
                              }}
                            />
                          </TableBody>
                        </Table>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter className="justify-center border-t p-4">
                  <IngredientForm
                    {...{
                      open,
                      setOpen,
                      id: ingredientId,
                      onCancel,
                    }}
                  />
                </CardFooter>
              </Card>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 md:hidden">
            <Button type="button" variant="outline" size="sm" onClick={cancel}>
              {t("discard")}
            </Button>
            <Button size="sm" type="submit">
              {t("save")}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default RecipeForm;
