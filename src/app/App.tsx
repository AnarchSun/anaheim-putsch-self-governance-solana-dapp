import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            queryFn: async ({ queryKey }) => {
                // Example: fallback to JSONPlaceholder for demo queries only
                const { data } = await axios.get(`https://jsonplaceholder.typicode.com${queryKey[0]}`);
                return data;
            },
        },
    },
});

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            {/* All your app components here */}
        </QueryClientProvider>
    );
}