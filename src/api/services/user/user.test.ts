import { userInfo } from "os";
import { UserService } from ".";

describe("auth", () => {
  let sut: UserService;

  beforeEach(() => {
    sut = new UserService();
  });

  it("should resolve with true and valid userId for valid token", async () => {
    const response = await sut.authenticate("fakeToken");
    expect(response).toEqual({ userId: "fakeUserId" });
  });

  it("should resolve with false for invalid token", async () => {
    const response = await sut.authenticate("fakeToken1");
    expect(response).toEqual({
      error: {
        type: "unauthorized",
        message: "Authentication Failed",
      },
    });
  });
});
