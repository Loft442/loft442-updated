import CapabilityStatementPage from "@/components/CapabilityStatementPage";
import Footer from "@/components/Footer";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Government Capability Statement",
  description:
    "LOFT 442 capability statement for government agencies and public offices: a veteran-owned event venue in Elmont, NY for ceremonies, meetings, trainings and receptions of up to 125 guests.",
  path: "/capability-statement",
  keywords: [
    "LOFT 442 capability statement",
    "veteran-owned event venue",
    "government event venue Nassau County",
    "government meeting space Queens NY",
    "agency event venue Long Island",
  ],
});

export default function CapabilityStatement() {
  return (
    <main className="bg-[var(--background)] pt-nav text-white print:bg-white print:pt-0">
      <CapabilityStatementPage />
      <div className="print:hidden">
        <Footer />
      </div>
    </main>
  );
}
