import type { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Loft442 Admin")
    .items([
      S.listItem()
        .title("Gallery")
        .schemaType("galleryItem")
        .child(
          S.documentTypeList("galleryItem")
            .title("Gallery photos & videos")
            .defaultOrdering([{ field: "_createdAt", direction: "desc" }])
        ),
      S.listItem()
        .title("Availability Calendar")
        .child(
          S.document()
            .schemaType("availability")
            .documentId("availability")
            .title("Availability Calendar")
        ),
    ]);
