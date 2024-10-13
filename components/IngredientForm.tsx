import { Dispatch, SetStateAction, useEffect, useState } from "react";
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
  const { addIngredient, editIngredient, setLoading, setError } =
    useIngredientStore();
  const form = useForm<z.infer<typeof ingredientFormSchema>>({
    resolver: zodResolver(ingredientFormSchema),
    defaultValues: {
      name: "",
    },
  });
  const t = useTranslations("IngredientForm");
  const [isEdit, setIsEdit] = useState(false);

  // Fetch ingredient data if an id is provided
  useEffect(() => {
    const fetchIngredient = async (_id: string) => {
      setIsEdit(true);
      // setLoading(true);

      try {
        const response = await fetch(`/api/ingredients/${_id}`);
        if (!response.ok) {
          throw new Error(`Error fetching ingredient: ${response.statusText}`);
        }
        const data = await response.json();
        // Set form values with the fetched data
        if (response.ok) {
          form.reset({
            name: data.name,
          });
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          // setError(error.message);
        }
      } finally {
        // setLoading(false);
      }
    };

    if (id) {
      fetchIngredient(id);
    }
  }, [id, setLoading, setError, form]);

  async function onSubmit(values: z.infer<typeof ingredientFormSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    // console.log(values);
    // console.log("🚀 ~ onSubmit ~ values:", values);
    const name = String(values.name).trim();

    try {
      // setLoading(true);
      // setError(null);

      if (isEdit && id) {
        // Call updateIngradient if editing
        const editIngredientBody = {
          name,
        };

        const response = await fetch(`/api/ingredients/${id}`, {
          method: "PUT", // Use PUT method for update
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editIngredientBody), // Send the updated data
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        // Process the response
        const data = await response.json();
        console.log("🚀 ~ onSubmit ~ data:", data);
        editIngredient(data.id, editIngredientBody); // Call the update function in your store
      } else {
        // Call addIngredient if creating a new ingredient
        const newIngredientBody = { name };

        const response = await fetch("/api/ingredients", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newIngredientBody),
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        if (response.ok) {
          const data = await response.json();
          addIngredient({ id: data.id, ...newIngredientBody });
        }
      }

      form.reset();
      setOpen(false);
    } catch (error: unknown) {
      // Check if the error is an instance of Error
      if (error instanceof Error) {
        // setError(error.message);
      }
    } finally {
      // setLoading(false);
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
