# Panel Mocks Are Stages, Not Replicas

The mocks render real Kirby Panel components, which invites the reading that every value in them should trace back to Kirby: the view's three-value padding, its breakpoint steps, the margin its dialog portal reserves. We decided the opposite. A mock owes fidelity to the Plugin it depicts and to Kirby's tokens wherever a Panel component renders, and owes nothing to the values Kirby uses to size a full view.

The replica reading is defensible – it makes "does this match Kirby?" a mechanical check – but it obliges the layer to track chrome that a figure cropped to one component never shows, against every Kirby release, with no way to see the drift. It also produces figures that are wrong in the way that matters: a mock is a few hundred pixels wide inside a prose column, so Kirby's container queries and responsive buttons resolve differently there than they do against a viewport, and copying those rules across yields a figure no editor ever sees.

The stage reading collapses the obligation to one rule – borrow tokens where a component renders, own the frame – and moves the fidelity bar onto the thing readers actually check, which is whether the figure agrees with the Plugin.
