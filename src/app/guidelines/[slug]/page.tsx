import React from "react";
import { GUIDELINES_DATA } from "@/data/guidelinesData";
import { GuidelineDetailView } from "@/components/guidelines/GuidelineDetailView";

export function generateStaticParams() {
  return GUIDELINES_DATA.map((g) => ({
    slug: g.slug,
  }));
}

export default function GuidelinePage({
  params,
}: {
  params: { slug: string };
}) {
  return <GuidelineDetailView slug={params.slug} />;
}
