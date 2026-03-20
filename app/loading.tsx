import { Container, PageIntro } from "@/components/ui/primitives";
import { SkeletonPreview } from "@/components/ui/content-blocks";

export default function Loading() {
  return (
    <Container className="pb-16">
      <PageIntro
        eyebrow="Pratinjau Memuat"
        title="Sedang menyiapkan area baca."
        description="Skeleton statis membantu memvisualkan keadaan memuat sambil menjaga antarmuka tetap tenang."
      />
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <SkeletonPreview />
        <SkeletonPreview />
        <SkeletonPreview />
      </div>
    </Container>
  );
}
