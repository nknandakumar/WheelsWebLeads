"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import * as React from "react";

export type ActionCardProps = {
  title: string;
  description: string;
  href: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  ctaLabel?: string;
};

export function ActionCard({
  title,
  description,
  href,
  Icon,
  ctaLabel,
}: ActionCardProps) {
  return (
    <Link href={href} prefetch className="group block focus:outline-none">
      <Card className="h-48 lg:h-56 rounded-3xl transition-all border-4 border-gray-300 hover:shadow-2xl bg-[#E8FBF2] hover:border-gray- bg-[#142F45] text-white ">
        <CardHeader className="space-y-3">
          <Icon className="h-7 w-7 text-[#FF5E15]" />
          <CardTitle className="text-2xl flex font-semibold font-headline">
            {title}
          </CardTitle>
          <span>{description}</span>
        </CardHeader>
        <CardContent className="text-sm md:text-base pl-2 text-muted-foreground flex flex-col items-start justify-between">
          <div className="flex items-start gap-2">
            
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
