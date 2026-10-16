import type { InjectionKey } from "vue";

/** A host's claim that it is a SocialCard, so a Scene inside it shows itself at its best. */
export const socialCardKey: InjectionKey<boolean> = Symbol("social-card");
