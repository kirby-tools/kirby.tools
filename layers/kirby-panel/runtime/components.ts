import Empty from "#kirby-panel/components/Collection/Empty.vue";
import Dropdown from "#kirby-panel/components/Dropdowns/Dropdown.vue";
import DropdownItem from "#kirby-panel/components/Dropdowns/DropdownItem.vue";
import Input from "#kirby-panel/components/Forms/Input.vue";
import CheckboxesInput from "#kirby-panel/components/Forms/Input/CheckboxesInput.vue";
import ChoiceInput from "#kirby-panel/components/Forms/Input/ChoiceInput.vue";
import PicklistInput from "#kirby-panel/components/Forms/Input/PicklistInput.vue";
import SearchInput from "#kirby-panel/components/Forms/Input/SearchInput.vue";
import SelectInput from "#kirby-panel/components/Forms/Input/SelectInput.vue";
import StringInput from "#kirby-panel/components/Forms/Input/StringInput.vue";
import Toolbar from "#kirby-panel/components/Forms/Toolbar/Toolbar.vue";
import Box from "#kirby-panel/components/Layout/Box.vue";
import Header from "#kirby-panel/components/Layout/Header.vue";
import Icon from "#kirby-panel/components/Misc/Icon.vue";
import Button from "#kirby-panel/components/Navigation/Button.vue";
import ButtonGroup from "#kirby-panel/components/Navigation/ButtonGroup.vue";
import Link from "#kirby-panel/components/Navigation/Link.vue";
import Navigate from "#kirby-panel/components/Navigation/Navigate.vue";
import Section from "#kirby-panel/components/Sections/Section.vue";
import Label from "#kirby-panel/components/Text/Label.vue";
import Text from "#kirby-panel/components/Text/Text.vue";
import ViewButton from "#kirby-panel/components/View/Buttons/Button.vue";
import ViewButtons from "#kirby-panel/components/View/Buttons/Buttons.vue";
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
  "k-dropdown": Dropdown,
  "k-dropdown-item": DropdownItem,
  "k-empty": Empty,
  "k-header": Header,
  "k-icon": Icon,
  "k-input": Input,
  "k-input-validator": InputValidator,
  "k-label": Label,
  "k-link": Link,
  "k-navigate": Navigate,
  "k-picklist-input": PicklistInput,
  "k-search-input": SearchInput,
  "k-section": Section,
  "k-select-input": SelectInput,
  "k-string-input": StringInput,
  "k-text": Text,
  "k-toolbar": Toolbar,
  "k-view-button": ViewButton,
  "k-view-buttons": ViewButtons,
};
