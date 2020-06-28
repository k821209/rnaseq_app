import React from 'react';
import { HashRouter, Route } from 'react-router-dom';
import Box from './Box';
import HeaderTop from './Header';
import Navigation from './Navi';
import { Segment, Container, List, Icon } from 'semantic-ui-react';


function App() {
  return (
    <HashRouter>
      <Container>
        <HeaderTop />

        <Segment>
          <List bulleted
            style={{
              marginBottom: '0.2em',
              marginTop: '0.2em'
            }}
          >
            <List.Item>W.australiana genome and transcriptome database </List.Item>
            <List.Item>Published papers
              <List.List>
                <List.Item>Unpublished yet</List.Item>
              </List.List>
            </List.Item>
            <List.Item>Contact : kangyangjae@plantprofile.net</List.Item>
          </List>
        </Segment>

        <Segment><Navigation /></Segment>

        <Container>
          <Route path='/info/:geneNme' component={Box} />
        </Container>
        <Segment textAlign='center'>
          Hosted by Plant Genomics Lab | © Deevo | Gyeongsang National University
        </Segment>
      </Container>

    </HashRouter >
  )

}

export default App;