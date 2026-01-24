import { defineField, defineType } from "sanity";

export default defineType({
  name: "availability",
  title: "Availability Calendar",
  type: "document",
  fields: [
    defineField({
      name: "bookedDates",
      title: "Booked Dates",
      type: "array",
      of: [{ type: "date" }],
      options: { layout: "grid" },
    }),
    defineField({
      name: "note",
      title: "Internal Note",
      type: "text",
    }),
  ],
});
