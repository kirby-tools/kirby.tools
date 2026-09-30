import type { ExhibitionPageContent } from "~/utils/exhibition";

const GENERATED_CONTENT = {
  text: [
    {
      type: "heading",
      level: "h2",
      text: "Twenty-Eight Rooms, No One in Them",
    },
    {
      type: "text",
      text: "A school gym on the first morning of the holidays. A ferry terminal at four. Luise Frey photographs rooms once everyone has gone, with exposures so long the dust settles inside the frame. Twenty-eight large-format prints from six winters, on view at Kunsthalle Leipzig from 12 September.",
    },
  ],
  description:
    "Luise Frey photographs rooms just after everyone has left – twenty-eight large-format prints from six winters. Kunsthalle Leipzig, 12 September to 30 November.",
  dates: "12 September – 30 November 2026",
} satisfies Omit<ExhibitionPageContent, "title">;

export function useSceneGeneration(
  page: ExhibitionPage,
  notify: (notification: PanelNotificationProps) => void,
) {
  let fieldNames: string[] = [];
  let startContent: ExhibitionPageContent;

  const {
    isStreaming: isGenerating,
    start: startGeneration,
    stop: abort,
  } = useTokenStream(updateContent);

  function generate(selectedFieldNames: string[]) {
    fieldNames = selectedFieldNames;
    startContent = page.content.value;
    startGeneration();
  }

  // One structured answer streams its fields in the order of the page's
  // blueprint, so each field spends what is left of the tokens streamed so far.
  // Copilot appends to a blocks field and replaces any other field's value.
  function updateContent(tokenCount: number) {
    const { take, hasTokensLeft } = createTokenBudget(tokenCount);

    const changes: Partial<ExhibitionPageContent> = {};
    if (fieldNames.includes("text"))
      changes.text = [
        ...startContent.text,
        ...GENERATED_CONTENT.text.flatMap((block) => {
          const text = take(block.text);
          return text ? [{ ...block, text }] : [];
        }),
      ];
    if (fieldNames.includes("description"))
      changes.description =
        take(GENERATED_CONTENT.description) || startContent.description;
    if (fieldNames.includes("dates"))
      changes.dates = take(GENERATED_CONTENT.dates) || startContent.dates;
    page.update(changes);

    const isComplete = hasTokensLeft();
    if (isComplete) notify({ text: "Content generated" });
    return isComplete;
  }

  return { isGenerating, generate, abort };
}
