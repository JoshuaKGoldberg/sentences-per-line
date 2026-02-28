## Rule Details

When publishing a package, it's helpful to include some amount of attribution.
The npm supports two ways of defining attribution in a `package.json`:

- `author`: this is either a string with name, email, and url combined, or an object with `name`, `email`, and `url`.
This is generally the original creator of the package, or sole maintainer in smaller projects.
- `contributors`: a list of all collaborators contributing to the project.
Each item in the array has the same `name`, `email`, and `url` properties as `author` has.
