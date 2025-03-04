# Learning GraphQL Book

This project provides resources and code examples for GraphQL. Install dependencies with `npm install` and run scripts with `npm start`.

Ref. learning GraphQL - by

## Example Query

To try out a GraphQL query in CodeSandbox, you can use the following example:

```
query {
  totalPhotos
}

mutation newPhoto( $name: String!, $description: String) {
  postPhoto(name: $name, description: $description) {
    id
    name
    description
  }
}

#variable
{
  "name": "A sample A",
  "description": " A Sample Photo for Our Dataset"
}
```

This query fetches the title of the book with ID 1 and the name of its author.

when adding input type we do mutation as example

```
mutation newPhoto($input: PostPhotoInput!) {
  postPhoto(input: $input) {
    id
    url
    created
  }
}
```

from input type photo and add dummy data, we can query using

```
mutation newPhoto( $input: PostPhotoInput!) {
  postPhoto(input:$input) {
    id
    name
    url
    description
    category
  }
}

// and variables
{
  "input": {
    "name": "A sample A",
  "description": " A Sample Photo for Our Dataset"
  }
}
```
