import Empty from "#kirby-panel/components/Collection/Empty.vue";
import Dropdown from "#kirby-panel/components/Dropdowns/Dropdown.vue";
import DropdownItem from "#kirby-panel/components/Dropdowns/DropdownItem.vue";
import OptionsDropdown from "#kirby-panel/components/Dropdowns/OptionsDropdown.vue";
import Counter from "#kirby-panel/components/Forms/Counter.vue";
import Field from "#kirby-panel/components/Forms/Field.vue";
import Input from "#kirby-panel/components/Forms/Input.vue";
import CheckboxesInput from "#kirby-panel/components/Forms/Input/CheckboxesInput.vue";
import ChoiceInput from "#kirby-panel/components/Forms/Input/ChoiceInput.vue";
import PicklistInput from "#kirby-panel/components/Forms/Input/PicklistInput.vue";
import SearchInput from "#kirby-panel/components/Forms/Input/SearchInput.vue";
import SelectInput from "#kirby-panel/components/Forms/Input/SelectInput.vue";
import StringInput from "#kirby-panel/components/Forms/Input/StringInput.vue";
import ToggleInput from "#kirby-panel/components/Forms/Input/ToggleInput.vue";
import TextFieldPreview from "#kirby-panel/components/Forms/Previews/TextFieldPreview.vue";
import ToggleFieldPreview from "#kirby-panel/components/Forms/Previews/ToggleFieldPreview.vue";
import Toolbar from "#kirby-panel/components/Forms/Toolbar/Toolbar.vue";
import Box from "#kirby-panel/components/Layout/Box.vue";
import Header from "#kirby-panel/components/Layout/Header.vue";
import Table from "#kirby-panel/components/Layout/Table.vue";
import TableCell from "#kirby-panel/components/Layout/TableCell.vue";
import Icon from "#kirby-panel/components/Misc/Icon.vue";
import SortHandle from "#kirby-panel/components/Misc/SortHandle.vue";
import Button from "#kirby-panel/components/Navigation/Button.vue";
import ButtonGroup from "#kirby-panel/components/Navigation/ButtonGroup.vue";
import Link from "#kirby-panel/components/Navigation/Link.vue";
import Navigate from "#kirby-panel/components/Navigation/Navigate.vue";
import Pagination from "#kirby-panel/components/Navigation/Pagination.vue";
import Section from "#kirby-panel/components/Sections/Section.vue";
import Label from "#kirby-panel/components/Text/Label.vue";
import Text from "#kirby-panel/components/Text/Text.vue";
import ViewButton from "#kirby-panel/components/View/Buttons/Button.vue";
import ViewButtons from "#kirby-panel/components/View/Buttons/Buttons.vue";
import Draggable from "./Draggable.vue";
import InputValidator from "./InputValidator.vue";

/**
 * The Panel components a mock may use, under Kirby's own names. Registering all
 * of them would pull in the ones that read `window.panel` at module scope,
 * which fails on the server; these do not, so mocks reach the initial HTML.
 */
export const components = {
  "k-box": Box,
  "k-button": Button,
  "k-button-group": ButtonGroup,
  "k-checkboxes-input": CheckboxesInput,
  "k-choice-input": ChoiceInput,
  "k-counter": Counter,
  "k-draggable": Draggable,
  "k-dropdown": Dropdown,
  "k-dropdown-item": DropdownItem,
  "k-empty": Empty,
  "k-field": Field,
  "k-header": Header,
  "k-icon": Icon,
  "k-input": Input,
  "k-input-validator": InputValidator,
  "k-label": Label,
  "k-link": Link,
  "k-navigate": Navigate,
  "k-options-dropdown": OptionsDropdown,
  "k-pagination": Pagination,
  "k-picklist-input": PicklistInput,
  "k-search-input": SearchInput,
  "k-section": Section,
  "k-select-input": SelectInput,
  "k-sort-handle": SortHandle,
  "k-string-input": StringInput,
  "k-table": Table,
  "k-table-cell": TableCell,
  "k-text": Text,
  "k-text-field-preview": TextFieldPreview,
  "k-toggle-field-preview": ToggleFieldPreview,
  "k-toggle-input": ToggleInput,
  "k-toolbar": Toolbar,
  "k-view-button": ViewButton,
  "k-view-buttons": ViewButtons,
};
