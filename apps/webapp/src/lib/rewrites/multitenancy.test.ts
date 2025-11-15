import { expect, test } from "vitest";
import { getHostType } from "./multitenancy";

const domains = {
  "www.marriednext.com": { isTenantHost: false, firstLabel: "www" },
  "admin.marriednext.com": { isTenantHost: false, firstLabel: "admin" },
  "api.marriednext.com": { isTenantHost: false, firstLabel: "api" },
  "app.marriednext.com": { isTenantHost: false, firstLabel: "app" },
  "dashboard.marriednext.com": { isTenantHost: false, firstLabel: "dashboard" },
  "blog.marriednext.com": { isTenantHost: false, firstLabel: "blog" },
  "docs.marriednext.com": { isTenantHost: false, firstLabel: "docs" },
  "marriednext.com": { isTenantHost: false, firstLabel: "marriednext" },
  "yulissaandmatthew.com": {
    isTenantHost: false,
    firstLabel: "yulissaandmatthew",
  },
  "www.yulissaandmatthew.com": { isTenantHost: false, firstLabel: "www" },
  localhost: { isTenantHost: false, firstLabel: "localhost" },
  "localhost:3000": { isTenantHost: false, firstLabel: "localhost" },
  "emilyandjack.localhost:3000": {
    isTenantHost: true,
    firstLabel: "emilyandjack",
  },
  "sarahandliam.localhost:3000": {
    isTenantHost: true,
    firstLabel: "sarahandliam",
  },
  "oliviaandnoah.localhost:3000": {
    isTenantHost: true,
    firstLabel: "oliviaandnoah",
  },
  "avaandjames.localhost:3000": {
    isTenantHost: true,
    firstLabel: "avaandjames",
  },
  "miaandlucas.localhost:3000": {
    isTenantHost: true,
    firstLabel: "miaandlucas",
  },
  "harperandmason.localhost:3000": {
    isTenantHost: true,
    firstLabel: "harperandmason",
  },
  "isabellaandlogan.localhost:3000": {
    isTenantHost: true,
    firstLabel: "isabellaandlogan",
  },
  "ameliaandlevi.localhost:3000": {
    isTenantHost: true,
    firstLabel: "ameliaandlevi",
  },
  "graceandhenry.localhost:3000": {
    isTenantHost: true,
    firstLabel: "graceandhenry",
  },
  "scarlettandowen.marriednext.com": {
    isTenantHost: true,
    firstLabel: "scarlettandowen",
  },
  "ellaanthomas.marriednext.com": {
    isTenantHost: true,
    firstLabel: "ellaanthomas",
  },
  "chloe-and-william.marriednext.com": {
    isTenantHost: true,
    firstLabel: "chloe-and-william",
  },
  "zoeandtheo.marriednext.com": {
    isTenantHost: true,
    firstLabel: "zoeandtheo",
  },
  "lilyandben.marriednext.com": {
    isTenantHost: true,
    firstLabel: "lilyandben",
  },
  "noraandjackson.marriednext.com": {
    isTenantHost: true,
    firstLabel: "noraandjackson",
  },
  "aurora-and-miles.marriednext.com": {
    isTenantHost: true,
    firstLabel: "aurora-and-miles",
  },
  "violetandcarter.marriednext.com": {
    isTenantHost: true,
    firstLabel: "violetandcarter",
  },
  "hannahandwyatt.marriednext.com": {
    isTenantHost: true,
    firstLabel: "hannahandwyatt",
  },
  "ellieanddaniel.marriednext.com": {
    isTenantHost: true,
    firstLabel: "ellieanddaniel",
  },
  "ruby-and-arthur.marriednext.com": {
    isTenantHost: true,
    firstLabel: "ruby-and-arthur",
  },
};

test("getHostType should return the correct host type", () => {
  Object.entries(domains).forEach(([domain, expected]) => {
    expect(getHostType(domain)).toEqual(expected);
  });
});
