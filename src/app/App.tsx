import React, { Suspense, useContext, useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { I18nProvider } from '../_metronic/i18n/i18nProvider'
import { LayoutProvider, LayoutSplashScreen } from '../_metronic/layout/core'
import AuthInit from './modules/auth/redux/AuthInit'
import { Routes } from './routing/Routes'
import ContextProvider, { AppContext } from '../context/Context'
type Props = {
  basename: string
}
const App: React.FC<Props> = ({ basename }) => {
  const { token } = useContext(AppContext);
  useEffect(() => {
    (window as any).process = {
      ...window.process,
    };
  }, []);
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <BrowserRouter basename={basename}>
        <I18nProvider>
            <LayoutProvider>
              <ContextProvider>
                <AuthInit>
                  <Routes />
                </AuthInit>
              </ContextProvider>
            </LayoutProvider>
        </I18nProvider>
      </BrowserRouter>
    </Suspense>
  )
}

export { App }
