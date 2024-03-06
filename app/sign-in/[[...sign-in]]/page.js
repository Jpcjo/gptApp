import { SignIn } from "@clerk/nextjs";
// check the doc in Clerk. The folders have to be set up this way according clerk

// Folder Structure: [[...sign-in]].
// Any url address after sign-in(including itself) will be displaying on this page.

// https://clerk.com/docs/components/authentication/sign-in
const SignInPage = () => {
  return (
    <div className="min-h-screen flex justify-center items-center">
      <SignIn />
    </div>
  );
};
export default SignInPage;
