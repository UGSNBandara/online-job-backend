# JavaScript Modules: CommonJS vs ES Modules

## CommonJS (CJS)
- **Default in Node.js** (before ES Modules)
- Uses `require()` to import and `module.exports` to export
- Files usually have `.js` extension
- Example:
  ```javascript
  // math.js
  function add(a, b) { return a + b; }
  module.exports = { add };

  // app.js
  const math = require('./math');
  console.log(math.add(2, 3));
  ```
- Synchronous loading (not suitable for browsers)

## ES Modules (ESM)
- **Standard in modern JavaScript** (supported in Node.js and browsers)
- Uses `import` and `export` keywords
- Files have `.mjs` extension or set `"type": "module"` in `package.json`
- Example:
  ```javascript
  // math.mjs
  export function add(a, b) { return a + b; }

  // app.mjs
  import { add } from './math.mjs';
  console.log(add(2, 3));
  ```
- Asynchronous loading (works in browsers and Node.js)

## Key Differences
| Feature         | CommonJS                | ES Modules           |
|-----------------|------------------------|----------------------|
| Import syntax   | `require()`             | `import`             |
| Export syntax   | `module.exports`        | `export`             |
| File extension  | `.js`                   | `.mjs` or `.js`      |
| Node.js support | Default                 | Needs config         |
| Browser support | No                      | Yes                  |
| Loading         | Synchronous             | Asynchronous         |

## When to Use Which?
- **CommonJS:**
  - Most Node.js projects by default
  - When you need compatibility with older Node.js code
- **ES Modules:**
  - When targeting browsers
  - For modern Node.js projects (set `"type": "module"` in `package.json`)
  - When you want to use `import`/`export` syntax

## How to Switch to ES Modules in Node.js
1. Rename files to `.mjs` **or** set `"type": "module"` in `package.json`
2. Use `import`/`export` instead of `require`/`module.exports`

---


---

## Common HTTP Status Codes

HTTP status codes are used in API responses to indicate the result of a request:

| Code | Meaning                      | Usage Example                          |
|------|------------------------------|----------------------------------------|
| 200  | OK                           | Successful GET, PUT, DELETE requests   |
| 201  | Created                      | Resource successfully created (POST)   |
| 400  | Bad Request                  | Invalid input, missing fields          |
| 401  | Unauthorized                 | Authentication required/failed         |
| 403  | Forbidden                    | No permission to access resource       |
| 404  | Not Found                    | Resource does not exist                |
| 409  | Conflict                     | Duplicate resource, e.g. email exists  |
| 500  | Internal Server Error        | Unexpected server error                |

**How to use:**
- Set the status code in your API response to communicate the result to the client.
- Example: `res.status(400).json({ message: 'Bad request' })`


---

## Mongoose `.populate()` Explained

In Mongoose, `.populate()` is used to automatically fetch and embed referenced documents (like users) in your query results.

**Example:**
If your Message model has `sender_id` and `receiver_id` as references to User documents, you can use:

```js
Message.find(...)
  .populate('sender_id', 'firstName lastName profileImage role')
  .populate('receiver_id', 'firstName lastName profileImage role')
```

This will replace the IDs with the actual user details in the result, making your API responses richer and easier to use in the frontend.

**Summary:**
`.populate()` fetches related documents for you, based on references in your schema.

For more details or examples, ask for a deep dive!
