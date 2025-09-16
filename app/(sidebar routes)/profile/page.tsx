import ProfileAvatar from "@/components/ProfileAvatar/ProfileAvatar";
import ProfileEditForm from "@/components/ProfileEditForm/ProfileEditForm";
import AuthHydration from "@/components/AuthHydration/AuthHydration";
import { getMe } from "@/lib/api/serverApi";

export default async function ProfilePage() {
  const user = await getMe();
  return (
    <div>
      <AuthHydration user={user} />
      <ProfileAvatar />
      <ProfileEditForm />
    </div>
  );
}
