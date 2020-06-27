import React from 'react';
import {
    Segment,
    Container,
    Header,
} from 'semantic-ui-react';
function headerTop() {
    return (
        <Container>
            <Segment inverted textAlign="center">
                <Header
                    as="h1"
                    content='Wolffia australiana RNAseq DB'
                    inverted color='yellow'
                    style={{
                        fontSize: '3em',
                        fontWeight: '900',
                        marginBottom: '0.5em',
                        marginTop: '0.5em',
                    }}
                />
            </Segment>
        </Container>)

}
export default headerTop;