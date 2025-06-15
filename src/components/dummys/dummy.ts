// dummy.ts

const dummy_value = 42; // Warning: Unused constant
// Soit tu utilises dummy_value, par exemple :
console.log(dummy_value);
type DummyContext<T> = {
  context: T;
  name: string;
};

export const dummy: DummyContext<string> = {
  context: "Dummy",
  name: "Test",
};

export function Dummy(): string {
  return "Je suis un dummy, mais utile.";
}
