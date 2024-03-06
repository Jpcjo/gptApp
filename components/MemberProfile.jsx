import React from "react";
import { UserButton, currentUser, auth } from "@clerk/nextjs";
import { fetchOrGenerateTokens } from "@/utils/action";

// https://clerk.com/docs/components/user/user-button
// https://clerk.com/docs/references/nextjs/current-user
// https://clerk.com/docs/references/nextjs/auth

const MemberProfile = async () => {
  const user = await currentUser();
  // console.log(user);
  const { userId } = auth();
  await fetchOrGenerateTokens(userId);
  //   const { userId } = auth(); // check doc. Use link above
  //   console.log(userId);

  return (
    <div className="px-4 flex items-center gap-2">
      <UserButton afterSignOutUrl="/" />
      <p> {user.emailAddresses[0].emailAddress}</p>
    </div>
  );
};

export default MemberProfile;
