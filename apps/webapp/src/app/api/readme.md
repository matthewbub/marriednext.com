# API Readme

## Layers

```
<request>
<input_validation>
<user_permissions>
<facade>
<response>
```

No DB calls, no api calls, no messy JavaScript "chop and slops" in the API routes. **Move it to a facade please**. The ideal facade is the SDK mirror of the API itself.

```ts
function facade(input): output {}
```

The goal is to create layers. (Api layer, business layer)
