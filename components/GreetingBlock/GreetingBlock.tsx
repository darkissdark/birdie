import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getMe, checkServerSession } from "@/lib/api/serverApi";
import GreetingBlockClient from "./GreetingBlockClient";

const GreetingBlock = async () => {
  const queryClient = new QueryClient();

  try {
    const isAuth = await checkServerSession();
    if (isAuth?.data?.success) {
      await queryClient.prefetchQuery({
        queryKey: ["currentUser"],
        queryFn: () => getMe(),
      });
    }
  } catch (error) {
    console.error("Error prefetching user for greeting:", error);
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <GreetingBlockClient />
    </HydrationBoundary>
  );
};

export default GreetingBlock;
