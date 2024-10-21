"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import useInviteLinkStore from "@/stores/inviteLinkStore";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { useTranslations } from "next-intl";

const AcceptInvitePage = ({ params }: { params: { inviteLinkId: string } }) => {
  const router = useRouter();
  const { inviteLinkId } = params;
  const { acceptInvite, error } = useInviteLinkStore();
  const [loading, setLoading] = useState(true);
  const success = useMemo(() => !error, [error]);
  const t = useTranslations("AcceptInvitePage");

  useEffect(() => {
    if (inviteLinkId) {
      acceptInvite(inviteLinkId)
        .then(() => {
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [inviteLinkId, acceptInvite, router]);

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-100">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex flex-col items-center justify-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">
                {t("description")}...
              </p>
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertTitle>{t("errorTitle")}</AlertTitle>
              <AlertDescription>{t("errorDescription")}</AlertDescription>
            </Alert>
          ) : (
            <Alert variant="default">
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>{t("successTitle")}</AlertTitle>
              <AlertDescription>{t("successDescription")}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter>
          {!loading && (
            <Button className="w-full" onClick={() => router.push("/")}>
              {t("goToDashboard")}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default AcceptInvitePage;
