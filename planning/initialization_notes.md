
## Package Setup
### Nix
Basic env, install npm, typescript, HTMX

### Verify
node -v
npm -v

## Site Setup
### Config for Website
npm init -y

### Typescript Config
npx tsc --init

### Setup Files
added src/
added src/main.ts
added public/
added public/index.html
added public/styles.css
added dist/

## Example Website
```src/main.ts
document.addEventListener("DOMContentLoaded", () => {
    console.log("Website loaded!");
});
```

```public/index.html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Website</title>
    <script src="https://unpkg.com/htmx.org@latest"></script>
    <script src="dist/main.js" defer></script>
</head>
<body>
    <h1>Hello, World!</h1>
    <button hx-get="/api/message" hx-trigger="click" hx-target="#response">
        Get Message
    </button>
    <div id="response"></div>
</body>
</html>
```

### Compile
npx tsc
// Doesn't do anything yet: only creates a main.js file

## Run
Can get a simple running server with
npx live-server public

## Backend
Added rust to nix shell

# How to run




