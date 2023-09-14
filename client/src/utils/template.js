// This function parses a string containing the outline of a book (chapters, sections and items) and returns an object with the chapters, sections and items in 1D, 2D, 3D arrays.
export function parseOutline(result) {
  let chapters = []; // Contains the list of the chapters
  let sections = []; // 2D array containing the sections of each chapter

  let currentChapter = -1; // Index of the current chapter
  let currentSection = -1; // Index of the current section
  let lines = result.split("\n");
  // We ignore all the lines preceding the "# Outline"
  let outlineIndex = lines.findIndex((line) => line.startsWith("//#**#//"));
  lines = lines.slice(outlineIndex + 1);
  for (let i = 0; i < lines.length; i++) {
    // Remove leading and trailing spaces, and tabs
    let line = lines[i].trim();
    line = line.replace(/\t/g, "");
    if (line !== "") {
      if (line.startsWith("/#)(#/")) {
        currentChapter++;
        currentSection = -1;
        sections.push([]); // Add a new array for the sections of the new chapter

        let chapterTitle = line.replace("/#)(#/", '');
        chapters.push(chapterTitle);
      } else if (line.startsWith("/#][#/")) {
        currentSection++;
        let sectionTitle = line.replace("/#][#/", '');
        sections[currentChapter].push(sectionTitle);
      }
    }
  }

  return { chapters, sections };
}
