import { useState } from "react";
import { Button } from "@/components/ui/button";
import React from "react";
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
import useRecipeStore from "@/stores/recipeStore";
import useIngredientStore from "@/stores/ingredientStore";
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
    .min(1, "At least one ingredient is required"),
});

const RecipeForm = () => {
  const router = useRouter();
  const addRecipe = useRecipeStore((state) => state.addRecipe);
  const setError = useRecipeStore((state) => state.setError);
  const setLoading = useRecipeStore((state) => state.setLoading);
  const form = useForm<z.infer<typeof recipeFormSchema>>({
    resolver: zodResolver(recipeFormSchema),
    defaultValues: {
      name: "",
      ingredients: [],
    },
  });
  const t = useTranslations("RecipeForm");

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
    console.log("🚀 ~ onSubmit ~ values:", values);
    const name = values.name;
    const ingredients = values.ingredients;

    try {
      setLoading(true);
      setError(null);

      const newRecipe = {
        name,
        ingredients,
      };

      const response = await fetch("/api/recipes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newRecipe),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      if (response.ok) {
        const data = await response.json();
        addRecipe({ id: data.id, ...newRecipe });
        form.reset();
        back();
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={back}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Button>
            <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
              {t("new")}
            </h1>
            <div className="hidden items-center gap-2 md:ml-auto md:flex">
              <Button variant="outline" size="sm" onClick={cancel}>
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
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <IngredientList {...field} />
                          </TableBody>
                        </Table>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter className="justify-center border-t p-4">
                  <IngredientForm />
                </CardFooter>
              </Card>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 md:hidden">
            <Button variant="outline" size="sm" onClick={cancel}>
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
