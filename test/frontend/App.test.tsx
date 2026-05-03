import { describe, expect, test, beforeEach, jest } from "@jest/globals";
import { render, screen, waitFor } from "@testing-library/react-native";
import App from "../../App";

const graphQlResult = {
  data: {
    sizzlingHotProducts: {
      daily: [
        {
          date: "21/04/2026",
          productId: "P1",
          productName: "Ezy Storage 37L Flexi Laundry Basket - White",
          salesCount: 3
        },
        {
          date: "22/04/2026",
          productId: "P1",
          productName: "Ezy Storage 37L Flexi Laundry Basket - White",
          salesCount: 2
        },
        {
          date: "23/04/2026",
          productId: "P6",
          productName: "Arlec 160W Crystalline Solar Foldable Charging Kit",
          salesCount: 1
        }
      ],
      period: {
        startDate: "21/04/2026",
        endDate: "23/04/2026",
        productId: "P1",
        productName: "Ezy Storage 37L Flexi Laundry Basket - White",
        salesCount: 6
      }
    }
  }
};

beforeEach(() => {
  jest.resetAllMocks();
});

describe("App", () => {
  test("Given the GraphQL request succeeds, When the app loads, Then it renders the period and daily winners", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(graphQlResult)
      } as Response)
    );

    render(<App />);

    expect(screen.getByText("Loading sizzling hot products...")).toBeTruthy();

    await waitFor(() => {
      expect(screen.getByText("Daily History")).toBeTruthy();
    });

    expect(
      screen.getAllByText("Ezy Storage 37L Flexi Laundry Basket - White").length
    ).toBeGreaterThan(0);
    expect(
      screen.getByText("Arlec 160W Crystalline Solar Foldable Charging Kit")
    ).toBeTruthy();
    expect(screen.getByText("6 qualified sales")).toBeTruthy();
  });

  test("Given the GraphQL request fails, When the app loads, Then it renders an error state", async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error("Network down")));

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("Unable to load products")).toBeTruthy();
    });

    expect(screen.getByText("Network down")).toBeTruthy();
  });
});
