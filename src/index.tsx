import ReactDOM from 'react-dom';
import App from './App';
import {QueryClient, QueryClientProvider} from 'react-query'
import { ReactQueryDevtools } from 'react-query-devtools';

const queryClient = new QueryClient();



ReactDOM.render(
  <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        <App />
  </QueryClientProvider>
  ,document.getElementById('root')
);
