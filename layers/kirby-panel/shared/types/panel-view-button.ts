/** The props of one view button, as a blueprint's `buttons` map defines them. */
export type PanelViewButtonProps = Record<string, unknown>;

/** A view button, or the name of one Kirby ships such as `"-"`. */
export type PanelViewButton = PanelViewButtonProps | string;
