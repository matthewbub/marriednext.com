"use client";

import Image from "next/image";
import { TenantHomePage } from "component-shelf";
import RsvpFormContainer from "@/components/RsvpFormContainer";
import { useWeddingData } from "@/contexts/WeddingDataContext";

export default function Home() {
  const weddingData = useWeddingData();

  return (
    <TenantHomePage
      fieldNameA={weddingData.fieldNameA}
      fieldNameB={weddingData.fieldNameB}
      fieldLocationName={weddingData.fieldLocationName}
      fieldLocationAddress={weddingData.fieldLocationAddress}
      fieldMapsShareUrl={weddingData.fieldMapsShareUrl}
      imageComponent={
        <Image
          src="https://q8a0jhjw1u.ufs.sh/f/3POoQHRcbaUOsRkrN3Yzk9tQwr7sxHynVo4JE0OBaUh8jlAZ"
          alt={`${weddingData.fieldNameA} and ${weddingData.fieldNameB}`}
          width={420}
          height={500}
          quality={100}
        />
      }
      rsvpFormComponent={<RsvpFormContainer variant="tenant" />}
    />
  );
}
