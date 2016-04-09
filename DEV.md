# Development Notes

This document contains notes concerning the development of **meteoric** project.

## Directory/File Structure
* **src/** contains meteoric source codes.
* **doc/** contains documentation generators.
* **gulpfile.js** contains automation scripts.

## Documentation generations

By reading on *ionic* project, and figuring out how they generate
documentation, I learned what they did and implemented it here. The
following are key gulp automation tasks when working with documentation:

* `gulp doc`: Creates and setup the doc website in doc-build/ directory.
* `gulp setup-meteor-doc-project`: Just does the setup part of `gulp doc`.

That's it.