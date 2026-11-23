import type { InjectionKey } from "vue";

/** A host's claim that it renders a Scene to a PNG, so the Scene shows itself at its best. */
export const sceneInPngKey: InjectionKey<boolean> = Symbol("scene-in-png");
