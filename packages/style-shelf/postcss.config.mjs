const isDev = process.env.NODE_ENV === "development";

export default {
  plugins: {
    "postcss-import": {},
    "postcss-mixins": {},
    ...(isDev ? {} : { "postcss-nested": {} }),
    autoprefixer: {},
    "@tailwindcss/postcss": {},
  },
};
