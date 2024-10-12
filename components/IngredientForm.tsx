import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { PlusCircle } from "lucide-react";
import useIngredientStore from "@/stores/ingredientStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { useTranslations } from "next-intl";

export const ingredientFormSchema = z.object({
  name: z.string().min(1).max(30),
});

const IngredientForm = ({ id }: { id?: string }) => {
  const [open, setOpen] = useState(false);
  const { addIngredient, setLoading, setError } = useIngredientStore();
  const form = useForm<z.infer<typeof ingredientFormSchema>>({
    resolver: zodResolver(ingredientFormSchema),
    defaultValues: {
      name: "",
    },
  });
  const t = useTranslations("IngredientForm");

  async function onSubmit(values: z.infer<typeof ingredientFormSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    // console.log(values);
    // console.log("🚀 ~ onSubmit ~ values:", values);
    const name = String(values.name).trim();

    try {
      setLoading(true);
      setError(null);

      const newIngredient = { name };

      const response = await fetch("/api/ingredients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newIngredient),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      if (response.ok) {
        const data = await response.json();
        addIngredient({ id: data.id, ...newIngredient });
        form.reset();
        setOpen(false);
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Sheet {...{ open, onOpenChange: setOpen }}>
      <SheetTrigger asChild>
        <Button size="sm" variant="ghost" className="gap-1">
          <PlusCircle className="h-3.5 w-3.5" />
          {t("addIngredient")}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <SheetHeader>
              <SheetTitle>{t("newIngredient")}</SheetTitle>
            </SheetHeader>
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">{t("name")}</FormLabel>
                    <FormControl>
                      <Input
                        className="col-span-3"
                        placeholder={t("ingredientNamePlaceholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="col-span-3 col-start-2" />
                  </FormItem>
                )}
              />
            </div>
            <SheetFooter>
              <Button type="submit">{t("save")}</Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};

export default IngredientForm;
