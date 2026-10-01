# Mocks Replace Screencasts

The site showed screencasts. Each went stale with the next Panel release or Plugin change, and most of its running time was setup around a few seconds of result. We removed them and let the Mocks carry what they showed: an Interactive Mock plays the Plugin's answer when the reader acts, and a Scene the reader scrolls to may play its way there once on its own first, from the view button on. An answer whose trigger no reader would find, like the moment an editor stops typing, plays over and over in a Looping Mock instead.

The alternative was a scripted replay – a timeline with a drawn cursor and keycaps, like the screencasts. It needs positions for every Stage size and breaks with each layout change the Mocks otherwise absorb through Kirby's pinned source. The one cursor we keep is not a timeline: each of its clicks finds the real button or option as it plays, and it gives way to any input from the reader, so the Mock stays theirs to type into.
