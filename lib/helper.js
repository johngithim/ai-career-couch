export function entriesToMarkdown(entries, type) {
  if (!entries?.length) return "";

  return (
    `## ${type}\n\n` +
    entries
      .map((entry) => {
        const dataRange = entry.current
          ? `${entry.startDate} - present`
          : `${entry.startDate} - ${entry.endDate}`;
        return `### ${entry.title} @ ${entry.organization}\n${dataRange}\n\n${entry.description}`;
      })
      .join("\n\n")
  );
}
