import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getUserStats, checkServerSession } from "@/lib/api/serverApi";
import StatusBlockClient from "./StatusBlockClient";

const StatusBlock = async () => {
  const queryClient = new QueryClient();

  try {
    const isAuth = await checkServerSession();

    if (isAuth?.data?.success) {
      await queryClient.prefetchQuery({
        queryKey: ["userStats"],
        queryFn: () => getUserStats(),
      });
    }
  } catch (error) {
    console.error("Error prefetching user stats:", error);
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <StatusBlockClient />
    </HydrationBoundary>
  );
};

export default StatusBlock;
