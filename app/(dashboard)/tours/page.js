import ToursPage from "@/components/ToursPage";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getAllTours } from "@/utils/action";

// This component ensures that the data is fetched in the background before
// rendering the ToursPage component.

// It uses the HydrationBoundary component to hydrate the prefetched data
// into the React Query cache. This ensures that the prefetched data is
// available when the ToursPage component is rendered.

export default async function AllToursPage() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["tours", ""],
    queryFn: () => getAllTours(),
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ToursPage />
    </HydrationBoundary>
  );
}
