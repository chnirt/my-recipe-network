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
import { toast } from "@/hooks/use-toast";

const ingredientSchema = z.object({
  name: z.string().min(1, "Ingredient name is required"), // Tên ingredient phải là chuỗi và không rỗng
  quantity: z
    .number()
    .nonnegative("Quantity must be greater than or equal to 0"), // Số lượng phải là số dương
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
    ],
    { invalid_type_error: "Invalid unit" }, // Đơn vị phải nằm trong danh sách định trước
  ),
});

const recipeFormSchema = z.object({
  name: z.string().min(1, "Recipe name is required"), // Tên recipe không được để trống
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
  const router = useRouter();
  const { addRecipe, editRecipe, setError, setLoading } = useRecipeStore();
  const form = useForm<z.infer<typeof recipeFormSchema>>({
    resolver: zodResolver(recipeFormSchema),
    defaultValues: {
      name: "",
      ingredients: [],
    },
  });
  const t = useTranslations("RecipeForm");
  const [isEdit, setIsEdit] = useState(false);
  const [open, setOpen] = useState(false);
  const [ingredientId, setIngredientId] = useState("");

  // Fetch data if we are in edit mode
  useEffect(() => {
    // Fetch the ingredient by ID
    const fetchRecipeById = async (_id: string) => {
      setIsEdit(true);
      setLoading(true);

      try {
        const response = await fetch(`/api/recipes/${_id}`);
        if (!response.ok) {
          throw new Error(`Error fetching ingredient: ${response.statusText}`);
        }
        const data = await response.json();
        // console.log("🚀 ~ fetchRecipeById ~ data:", data);

        if (response.ok) {
          form.reset({
            name: data.name,
            ingredients: data.ingredients,
          });
        }
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        }
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchRecipeById(id);
    }
  }, [form, id, setError, setLoading]);

  function back() {
    router.back();
  }

  function cancel() {
    back();
  }

  async function onSubmit(values: z.infer<typeof recipeFormSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    // console.log(values);
    // console.log("🚀 ~ onSubmit ~ values:", values);
    const name = values.name;
    const ingredients = values.ingredients;

    try {
      setLoading(true);
      setError(null);

      if (isEdit && id) {
        // Call editRecipe if editing
        const editRecipeBody = {
          name,
          ingredients,
        };

        const response = await fetch(`/api/recipes/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editRecipeBody),
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        if (response.ok) {
          const data = await response.json();
          editRecipe(data.id, editRecipeBody);
          toast({
            title: t("editedTitle"),
            description: t("editedDescription"),
          });
        }
      } else {
        // Call addRecipe if creating a new recipe
        const newRecipeBody = {
          name,
          ingredients,
        };

        const response = await fetch("/api/recipes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newRecipeBody),
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        if (response.ok) {
          const data = await response.json();
          addRecipe({ id: data.id, ...newRecipeBody });
          toast({
            title: t("createdTitle"),
            description: t("createdDescription"),
          });
        }
      }

      form.reset();
      back();
    } catch (error: unknown) {
      // Check if the error is an instance of Error
      if (error instanceof Error) {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  function onIngredientClick(id: string) {
    // console.log("🚀 ~ onIngredientClick ~ id:", id);

    setIngredientId(id);
    setOpen(true);
  }

  function onCancel() {
    // setIngredientId("");
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
              {isEdit ? t("edit") : t("new")}
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
                {t("save")}
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
                              <TableHead>{t("quantity")}</TableHead>
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
                              {...{ ...field, onIngredientClick }}
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
