import type { ExhibitionPageContent } from "~/utils/exhibition";

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
        ...EXHIBITION_PAGE.text.flatMap((block) => {
          const text = take(block.text);
          return text ? [{ ...block, text }] : [];
        }),
      ];
    if (fieldNames.includes("description"))
      changes.description =
        take(EXHIBITION_PAGE.description) || startContent.description;
    if (fieldNames.includes("dates"))
      changes.dates = take(EXHIBITION_PAGE.dates) || startContent.dates;
    page.update(changes);

    const isComplete = hasTokensLeft();
    if (isComplete) notify({ text: "Content generated" });
    return isComplete;
  }

  return { isGenerating, generate, abort };
}
