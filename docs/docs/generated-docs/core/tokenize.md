<!-- Do not edit this file. It is automatically generated by API Documenter. -->

# tokenize (undefined)

**Signature:**

```typescript
export declare function tokenize<T extends TokenizeGrammar>(
  input: string,
  grammar: T,
): (
  | string
  | {
      type: keyof T;
      content: string;
    }
)[];
```
