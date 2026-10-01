import type { InjectionKey } from "vue";

/** A host's claim that it is a SocialCard, which shows its Scene at its best. */
export const socialCardKey: InjectionKey<boolean> = Symbol("social-card");
