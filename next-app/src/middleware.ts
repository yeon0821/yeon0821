import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: [
    "/users/mypage",
    "/stores/new",
    "/stores/:id/edit",
    "/users/likes",
  ],
};
