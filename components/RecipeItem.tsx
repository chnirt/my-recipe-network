import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Pen, Trash } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Recipe } from "@/stores/recipeStore";
import { useTranslations } from "next-intl";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
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

export default function RecipeItem({
  recipe,
  remove,
  isOwner,
  number,
}: {
  recipe: Recipe;
  remove: (id: string) => Promise<void>;
  isOwner: boolean;
  number: number;
}) {
  const t = useTranslations();
  const router = useRouter();
  const { userId } = useAuth();

  function edit() {
    router.push(`/${userId}/recipe/${recipe.id}`);
  }

  return (
    <Card className="xl:col-span-2" x-chunk="dashboard-01-chunk-4">
      <CardHeader className="flex flex-row items-center">
        <div className="flex flex-col justify-center">
          <CardTitle>
            {number}. {recipe.name}
          </CardTitle>
          <CardDescription>{recipe.note}</CardDescription>
        </div>
        {isOwner ? (
          <div className="ml-auto space-x-2">
            <Button
              variant="ghost"
              size="icon"
              className="gap-1"
              onClick={edit}
            >
              <Pen className="size-4" />
              <span className="sr-only">Pen</span>
            </Button>

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
                    {t("RecipeItem.deletedTitle")}
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    {t("RecipeItem.deletedDescription")}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>
                    {t("RecipeItem.cancel")}
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => (recipe.id ? remove(recipe.id) : undefined)}
                  >
                    {t("RecipeItem.continue")}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        ) : null}
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("RecipeItem.ingredient")}</TableHead>
              <TableHead className="text-right">
                {t("RecipeItem.amount")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recipe.ingredients.map((ingredient, idx) => (
              <TableRow key={idx}>
                <TableCell>
                  <div className="font-medium">{ingredient.name}</div>
                </TableCell>
                <TableCell className="text-right">
                  {ingredient.quantity} {t(`Units.${ingredient.unit}`)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
