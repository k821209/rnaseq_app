import React from 'react';
import { HashRouter, Route } from 'react-router-dom';
import Box from './Box';
import HeaderTop from './Header';
import Navigation from './Navi';
import { Header, Container } from 'semantic-ui-react';



function App() {
  return (
    <HashRouter>
      <HeaderTop />
      <Container>
        <Header>
          TEST
      </Header>
      </Container>

      <Navigation />
      <Route path='/:geneName' component={Box} />
    </HashRouter>
  )

}

export default App;