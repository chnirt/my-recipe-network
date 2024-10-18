import { Dispatch, SetStateAction, useEffect } from "react";
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
  name: z
    .string()
    .min(1, "Ingredient name is required")
    .max(30, "Ingredient name must be at most 30 characters long"),
});

const IngredientForm = ({
  open,
  setOpen,
  id,
  onCancel,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  id?: string;
  onCancel?: () => void;
}) => {
  const { addIngredient, fetchIngredient, editIngredient } =
    useIngredientStore();
  const form = useForm<z.infer<typeof ingredientFormSchema>>({
    resolver: zodResolver(ingredientFormSchema),
    defaultValues: {
      name: "",
    },
  });
  const t = useTranslations("IngredientForm");

  // Fetch ingredient data if an id is provided
  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        const ingredient = await fetchIngredient(id);
        if (ingredient) {
          form.reset({
            name: ingredient.name, // Set the fetched ingredient's name into the form
          });
        }
      };
      fetchData();
    }
  }, [id, fetchIngredient, form]);

  async function onSubmit(values: z.infer<typeof ingredientFormSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    // console.log("🚀 ~ onSubmit ~ values:", values);
    const name = String(values.name).trim();

    try {
      const newIngredient = { name };

      if (id) {
        editIngredient(id, newIngredient);
      } else {
        addIngredient(newIngredient);
      }

      setOpen(false);
    } catch (error: unknown) {
      // Check if the error is an instance of Error
      if (error instanceof Error) {
      }
    } finally {
    }
  }

  function handleOnOpenChange(openProp: boolean) {
    setOpen(openProp);

    if (typeof onCancel === "function") {
      onCancel();
    }

    // console.log("🚀 ~ handleOnOpenChange ~ open:", openProp);
    if (!openProp) {
      form.reset({
        name: "",
      });
    }
  }

  return (
    <Sheet {...{ open, onOpenChange: handleOnOpenChange }}>
      <SheetTrigger asChild>
        <Button size="sm" variant="ghost" className="gap-1">
          <PlusCircle className="h-3.5 w-3.5" />
          {t("addIngredient")}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <Form {...form}>
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
            <Button type="button" onClick={form.handleSubmit(onSubmit)}>
              {t("save")}
            </Button>
          </SheetFooter>
        </Form>
      </SheetContent>
    </Sheet>
  );
};

export default IngredientForm;
