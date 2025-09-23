import React from 'react'
import ReactDOM from 'react-dom'
import { SnackbarProvider } from 'notistack';
// react bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
// Apollo Client
import { onError } from "@apollo/client/link/error";
import { setContext } from '@apollo/client/link/context';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  HttpLink,
  from,
  NormalizedCacheObject
} from "@apollo/client";

// Redux
// https://github.com/rt2zz/redux-persist
import { PersistGate } from 'redux-persist/integration/react'
import { Provider } from 'react-redux'
import * as _redux from './setup'
import store, { persistor } from './setup/redux/Store'
// Axios
import axios from 'axios'
import { Chart, registerables } from 'chart.js'

// Apps
import { App } from './app/App'
import { MetronicI18nProvider } from './_metronic/i18n/Metronici18n'
/**
 * TIP: Replace this style import with dark styles to enable dark mode
 *
 * import './_metronic/assets/sass/style.dark.scss'
 *
 * TIP: Replace this style import with rtl styles to enable rtl mode
 *
 * import './_metronic/assets/css/style.rtl.css'
 **/
import './_metronic/assets/sass/style.scss'
import './_metronic/assets/sass/style.react.scss'
import './_metronic/assets/css/custom.css'
/**
 * Base URL of the website.
 *
 * @see https://facebook.github.io/create-react-app/docs/using-the-public-folder
 */
const { PUBLIC_URL } = process.env
/**
 * Creates `axios-mock-adapter` instance for provided `axios` instance, add
 * basic Metronic mocks and returns it.
 *
 * @see https://github.com/ctimmerm/axios-mock-adapter
 */

/* const mock = */ _redux.mockAxios(axios)
/**
 * Inject Metronic interceptors for axios.
 *
 * @see https://github.com/axios/axios#interceptors
 */
_redux.setupAxios(axios, store)

Chart.register(...registerables)

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>{
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
      if(message==="Unauthenticated."){
        client.cache.reset();
        localStorage.clear()
        window.location.href = "/auth/login"
      }
    }
    );
  if (networkError) console.log(`[Network error]: ${networkError}`);
});

const link = from([
  errorLink,
  new HttpLink({
    uri:
      window.location.host.includes('localhost:3000') ||
      window.location.host.includes('testbusiness.chuzeday.com')
        ? 'https://testbackend.chuzeday.com/graphql'
        : 'https://backend.chuzeday.com/graphql',
  }),
  // new HttpLink({ uri: window.location.host.includes("localhost:3011") ? "https://backend.chuzeday.com/graphql": "https://backend.chuzeday.com/graphql"}),
])
const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('token');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(link),
  // fetchOptions: {
  //   mode: 'no-cors',
  // },
});


ReactDOM.render(
  <MetronicI18nProvider>
    <ApolloProvider client={client}>
      <Provider store={store}>
        {/* Asynchronously persist redux stores and show `SplashScreen` while it's loading. */}
        <PersistGate persistor={persistor} loading={<div>Loading...</div>}>
          <SnackbarProvider maxSnack={1}>
            <App basename={PUBLIC_URL} />
          </SnackbarProvider>
        </PersistGate>
      </Provider>
    </ApolloProvider>
  </MetronicI18nProvider>,
  document.getElementById('root')
)
