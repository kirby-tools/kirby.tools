import type { ComponentOptions } from "vue";

/**
 * Copies a Kirby input with its placeholder resolved up front, since Kirby's
 * own default reads it off `window.panel` – undefined on a server.
 *
 * Spread rather than `extends`, which renders nothing on a server: Vue takes
 * `ssrRender` off the component itself.
 */
export function withPlaceholder(
  component: ComponentOptions,
  placeholder: string,
) {
  return {
    ...component,
    props: {
      ...component.props,
      placeholder: {
        type: String,
        default: placeholder,
      },
    },
  };
}
