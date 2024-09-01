import { describe, expect, it } from "bun:test";
import { clientService } from "./client.service";

describe("ClientService", () => {
  it("Success create client", async () => {
    const client = await clientService.create({
      name: "__spec__David",
    });

    expect(client).toHaveProperty("client_id");
    expect(client.name).toBe("__spec__David");
  });
});
