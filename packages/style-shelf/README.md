# Style Shelf

## Code Conventions

### container queries over media queries where appropriate.

Consider templates are scaffolded out in code, but bits and pieces are customizable for the end-user via the webapp. The templates rely on the usage of container queries to provide website builder-like experience.

examples / read more: https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Containment/Container_queries

### psuedo states use `&:`

if it can be avoided (it should be avoidable), do not use the full class name to target a psuedo state, but rather use nested css for consistent groupings

example:

```
.mn-navigation-list-item {
  border-bottom: 2px solid transparent;

  &:hover {
    border-bottom-color: var(--text-color);
  }
}
```

### no using `important!` ever

It's just creating a problem later. It can be easily avoided. Use order-of-specificity instead https://www.w3schools.com/css/css_specificity.asp.

### no shorthands for margins and paddings

i would say no shorthands at all but there are some like `animation` where it does make sense. its mostly for less of a mental overhead, easier refactors and qol

```css
/* not this */
margin: 15px 10px 40px 25px;

/* do this; be explicit */
margin-top: 15px;
margin-right: 10px;
margin-bottom: 40px;
margin-left: 25px;
```

### Container Query Mixin Convention

This should be the new default paradigm moving forward. We'll need to create a shit ton of mixins at first but eventually all of our mixins should be using this paradigm

here's an example of how we can reduce the clutter when managing container queries

```css
.mn-hiw {
  container-type: inline-size;

  .mn-hiw-inner-shell {
    grid-template-columns: repeat(12, 1fr);
  }

  .mn-hiw-leftside {
    grid-column: 1 / -1;
  }

  @container (width > 700px) {
    .mn-hiw-leftside {
      grid-column: 1 / 5;
    }
  }

  @container (width > 960px) {
    .mn-hiw-leftside {
      grid-column: 1 / 6;
    }
  }
}
```

with the mixins:

```css
.mn-hiw {
  container-type: inline-size;

  .mn-hiw-inner-shell {
    grid-template-columns: repeat(12, 1fr);
  }

  .mn-hiw-leftside {
    @mixin GridColumn 1 / -1, 1 / 5, 1 / 6;
  }
}
```
