import MainLayout from "layouts/Main";
import BasicInfoGenerator from "components/generator_info";
import PDFGenerator from "components/generator_pdf";

import "./_style.scss";
import { GeneratorInfoProvider } from "contexts/GeneratorInfoContext";

export default function GeneratorPage() {
  return (
    <MainLayout>
      <GeneratorInfoProvider>
        <div className="container mx-auto">
          <div className="hero-section flex flex-col items-center justify-center px-10">
            <h1 className="hero-headline">Boocademy Generator</h1>
            <p className="hero-text">
              You can search for unlimited learning products in our collection of
              e-books, audiobooks, assignments, case studies, and more. If you are
              missing something, let us know, and we will create it for you.
            </p>
          </div>
          <div className="h-48"></div>
          <BasicInfoGenerator />
          <PDFGenerator />
        </div>
      </GeneratorInfoProvider>
    </MainLayout>
  );
}
