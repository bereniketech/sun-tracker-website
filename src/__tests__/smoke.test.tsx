import HomePage from "@/app/page";

describe("HomePage", () => {
  it("returns a valid JSX tree", () => {
    const rendered = HomePage();

    expect(rendered).toBeTruthy();
  });
});