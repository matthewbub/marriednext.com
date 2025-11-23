# Component Shelf

## faq

### Why does this use Vite when the main app uses Next.js?

When I upgraded to Next.js `v16.0.1` I broke Storybook in when webapp directory. This was the kick-start to the turborepo environment we have now. I spun up a new Storybook in an external directory and am keeping this one in a stable state that is free from potential havoc that might be caused by the main web app.
