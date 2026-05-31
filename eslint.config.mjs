import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      // React 19's new react-hooks/set-state-in-effect is overzealous. It flags
      // every useEffect that calls setState — including legitimate patterns like
      // initial state hydration from localStorage, syncing with non-React state,
      // and conditional state updates after data fetches. Disabled because the
      // alternatives (use(), useSyncExternalStore) don't fit our patterns.
      // See: https://react.dev/reference/eslint-plugin-react-hooks
      "react-hooks/set-state-in-effect": "off",

      // react-hooks/immutability is similar — flags `let` declarations that get
      // reassigned inside hooks. Many of our patterns build incremental query
      // builders (Supabase) that reassign `query`. Off until we refactor to
      // chained immutable variants.
      "react-hooks/immutability": "off",

      // react-hooks/use-memo flags any complex expression in dep arrays. We
      // already use eslint-disable comments for the few legit cases.
      "react-hooks/use-memo": "off",

      // We use stable Supabase client instances that don't change reference
      // between renders. Adding them to useCallback/useEffect deps would
      // cause unnecessary re-executions.
      "react-hooks/exhaustive-deps": "off",

      // Allow underscore-prefixed unused vars (intentional placeholders).
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
    },
  },
]);

export default eslintConfig;
