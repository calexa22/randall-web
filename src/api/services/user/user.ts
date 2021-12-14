export type ErrorResponse = {
  error: {
    type: string;
    message: string;
  };
};

export type AuthResponse = ErrorResponse | { userId: string };

export class UserService {

  authenticate = (bearer: string): Promise<AuthResponse> =>
    new Promise((resolve, reject) => {
      const token = bearer.replace("Bearer ", "");

      if (token == "fakeToken") {
        resolve({ userId: "fakeUserId" });
      } else {
        resolve({
          error: { type: "unauthorized", message: "Authentication Failed" },
        });
      }
    });
}
