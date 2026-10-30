import type { ComponentPublicInstance, SetupContext } from "vue";
import { h } from "vue";
import Empty from "#kirby-panel/components/Collection/Empty.vue";
import DialogBody from "#kirby-panel/components/Dialogs/Elements/Body.vue";
import DialogButtons from "#kirby-panel/components/Dialogs/Elements/Buttons.vue";
import DialogFooter from "#kirby-panel/components/Dialogs/Elements/Footer.vue";
import Dropdown from "#kirby-panel/components/Dropdowns/Dropdown.vue";
import DropdownItem from "#kirby-panel/components/Dropdowns/DropdownItem.vue";
import OptionsDropdown from "#kirby-panel/components/Dropdowns/OptionsDropdown.vue";
import Counter from "#kirby-panel/components/Forms/Counter.vue";
import Field from "#kirby-panel/components/Forms/Field.vue";
import CheckboxesField from "#kirby-panel/components/Forms/Field/CheckboxesField.vue";
import EmailField from "#kirby-panel/components/Forms/Field/EmailField.vue";
import InfoField from "#kirby-panel/components/Forms/Field/InfoField.vue";
import StructureField from "#kirby-panel/components/Forms/Field/StructureField.vue";
import TextField from "#kirby-panel/components/Forms/Field/TextField.vue";
import TogglesField from "#kirby-panel/components/Forms/Field/TogglesField.vue";
import Fieldset from "#kirby-panel/components/Forms/Fieldset.vue";
import FormControls from "#kirby-panel/components/Forms/FormControls.vue";
import Input from "#kirby-panel/components/Forms/Input.vue";
import CheckboxesInput from "#kirby-panel/components/Forms/Input/CheckboxesInput.vue";
import ChoiceInput from "#kirby-panel/components/Forms/Input/ChoiceInput.vue";
import EmailInput from "#kirby-panel/components/Forms/Input/EmailInput.vue";
import PicklistInput from "#kirby-panel/components/Forms/Input/PicklistInput.vue";
import SearchInput from "#kirby-panel/components/Forms/Input/SearchInput.vue";
import SelectInput from "#kirby-panel/components/Forms/Input/SelectInput.vue";
import StringInput from "#kirby-panel/components/Forms/Input/StringInput.vue";
import TextareaInput from "#kirby-panel/components/Forms/Input/TextareaInput.vue";
import TextInput from "#kirby-panel/components/Forms/Input/TextInput.vue";
import ToggleInput from "#kirby-panel/components/Forms/Input/ToggleInput.vue";
import TogglesInput from "#kirby-panel/components/Forms/Input/TogglesInput.vue";
import TextFieldPreview from "#kirby-panel/components/Forms/Previews/TextFieldPreview.vue";
import ToggleFieldPreview from "#kirby-panel/components/Forms/Previews/ToggleFieldPreview.vue";
import Toolbar from "#kirby-panel/components/Forms/Toolbar/Toolbar.vue";
import Box from "#kirby-panel/components/Layout/Box.vue";
import Column from "#kirby-panel/components/Layout/Column.vue";
import Frame from "#kirby-panel/components/Layout/Frame/Frame.vue";
import IconFrame from "#kirby-panel/components/Layout/Frame/IconFrame.vue";
import ImageFrame from "#kirby-panel/components/Layout/Frame/ImageFrame.vue";
import Grid from "#kirby-panel/components/Layout/Grid.vue";
import Header from "#kirby-panel/components/Layout/Header.vue";
import Scrollable from "#kirby-panel/components/Layout/Scrollable.vue";
import Section from "#kirby-panel/components/Layout/Section.vue";
import Table from "#kirby-panel/components/Layout/Table.vue";
import TableCell from "#kirby-panel/components/Layout/TableCell.vue";
import Icon from "#kirby-panel/components/Misc/Icon.vue";
import SortHandle from "#kirby-panel/components/Misc/SortHandle.vue";
import Button from "#kirby-panel/components/Navigation/Button.vue";
import ButtonGroup from "#kirby-panel/components/Navigation/ButtonGroup.vue";
import Link from "#kirby-panel/components/Navigation/Link.vue";
import Navigate from "#kirby-panel/components/Navigation/Navigate.vue";
import Pagination from "#kirby-panel/components/Navigation/Pagination.vue";
import Tag from "#kirby-panel/components/Navigation/Tag.vue";
import Headline from "#kirby-panel/components/Text/Headline.vue";
import Label from "#kirby-panel/components/Text/Label.vue";
import Text from "#kirby-panel/components/Text/Text.vue";
import ViewButton from "#kirby-panel/components/View/Buttons/Button.vue";
import ViewButtons from "#kirby-panel/components/View/Buttons/Buttons.vue";
import LanguagesDropdown from "#kirby-panel/components/View/Buttons/LanguagesDropdown.vue";
import { sizeTextareaToContent } from "../app/utils/textarea";
import Draggable from "./Draggable.vue";
import PicklistDropdown from "./PicklistDropdown.vue";
import { translate } from "./translate";
import { withPlaceholder } from "./withPlaceholder";

/**
 * The Panel components a Mock may use, under Kirby's own names. Registering all
 * of them would pull in the ones that read `window.panel` while rendering,
 * which is undefined on a server; these do not, so Mocks reach the initial
 * HTML.
 */
export const components = {
  "k-box": Box,
  "k-button": Button,
  "k-button-group": ButtonGroup,
  "k-checkboxes-field": CheckboxesField,
  "k-checkboxes-input": CheckboxesInput,
  "k-choice-input": ChoiceInput,
  "k-column": Column,
  "k-counter": Counter,
  "k-draggable": Draggable,
  "k-dialog-body": DialogBody,
  "k-dialog-buttons": DialogButtons,
  "k-dialog-footer": DialogFooter,
  "k-dropdown": Dropdown,
  "k-dropdown-item": DropdownItem,
  "k-email-field": withPlaceholder(EmailField, translate("email.placeholder")),
  "k-email-input": withPlaceholder(EmailInput, translate("email.placeholder")),
  "k-empty": Empty,
  "k-field": Field,
  "k-fieldset": Fieldset,
  // Kirby's `discard()` asks first in a dialog, which no Mock stages.
  "k-form-controls": {
    ...FormControls,
    methods: {
      ...FormControls.methods,
      discard(this: { $emit: (event: "discard") => void }) {
        this.$emit("discard");
      },
    },
  },
  "k-frame": Frame,
  "k-grid": Grid,
  "k-header": Header,
  "k-headline": Headline,
  "k-icon": Icon,
  "k-icon-frame": IconFrame,
  "k-image-frame": ImageFrame,
  "k-info-field": InfoField,
  "k-input": Input,
  "k-label": Label,
  // Kirby loads the options from a dropdown route and reloads the view in the
  // picked language; a Mock passes the options, each switching on its `click`.
  "k-languages-dropdown": {
    ...LanguagesDropdown,
    props: { ...LanguagesDropdown.props, options: Array },
    methods: { ...LanguagesDropdown.methods, change() {} },
  },
  "k-link": Link,
  "k-navigate": Navigate,
  "k-options-dropdown": OptionsDropdown,
  "k-pagination": Pagination,
  // Kirby's `k-panel` is the whole Panel app; a Mock's stage stands in for it.
  "k-panel-outside": {
    setup(_props: unknown, { slots }: SetupContext) {
      return () => h("div", { class: "k-panel-outside" }, slots.default?.());
    },
  },
  "k-picklist-dropdown": PicklistDropdown,
  "k-picklist-input": PicklistInput,
  "k-scrollable": Scrollable,
  "k-search-input": withPlaceholder(SearchInput, `${translate("search")} …`),
  "k-section": Section,
  "k-select-input": SelectInput,
  "k-sort-handle": SortHandle,
  "k-string-input": StringInput,
  // Kirby's `add()` fills the new row through `window.panel`, then opens a
  // drawer, which no Mock stages.
  "k-structure-field": {
    ...StructureField,
    methods: { ...StructureField.methods, add() {} },
  },
  "k-table": Table,
  "k-table-cell": TableCell,
  "k-tag": Tag,
  "k-text": Text,
  "k-text-field": TextField,
  "k-text-field-preview": TextFieldPreview,
  // Kirby's `mounted` and `value` watcher run `$library.autosize`, which no
  // Mock carries: they size from script where `field-sizing` is missing, and
  // autofocus and preselect go.
  "k-textarea-input": {
    ...TextareaInput,
    mounted(this: ComponentPublicInstance) {
      sizeTextareaToContent(this.$refs.input as HTMLTextAreaElement);
    },
    watch: {
      async value(this: ComponentPublicInstance) {
        await this.$nextTick();
        sizeTextareaToContent(this.$refs.input as HTMLTextAreaElement);
      },
    },
  },
  // Kirby resolves the toolbar even where `buttons: false` hides it, and no
  // Mock shows one.
  "k-textarea-toolbar": { render: () => null },
  "k-text-input": TextInput,
  "k-toggle-field-preview": ToggleFieldPreview,
  "k-toggle-input": ToggleInput,
  "k-toggles-field": TogglesField,
  "k-toggles-input": TogglesInput,
  "k-toolbar": Toolbar,
  "k-view-button": ViewButton,
  "k-view-buttons": ViewButtons,
};
