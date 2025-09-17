import { getMe, checkServerSession } from "@/lib/api/serverApi";
import GreetingBlockClient from "./GreetingBlockClient";
import { User } from "@/types/user";

const GreetingBlock = async () => {
  let initialUser: User | null = null;

  try {
    const isAuth = await checkServerSession();

    if (isAuth?.data?.success) {
      initialUser = await getMe();
    }
  } catch (err) {
    console.error("Помилка завантаження користувача для привітання:", err);
  }

  return <GreetingBlockClient initialUser={initialUser} />;
};

export default GreetingBlock;
