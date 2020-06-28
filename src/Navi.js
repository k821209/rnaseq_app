import PropTypes from 'prop-types'
import _ from 'lodash'
import { Link } from 'react-router-dom';
import React, { Component } from 'react'
import axios from 'axios';
import { Search, Grid, Label, Container, Header } from 'semantic-ui-react'


const resultRenderer = ({ gene, search_terms, predicted_gene_name, eggnog_annot }) => {
    return (
        <Link to={{
            pathname: `/info/${gene}/`,
            state: { gene }
        }}>
            <Label> {search_terms} <Label.Detail>{eggnog_annot}</Label.Detail></Label>
        </Link>
    )
}
resultRenderer.propTypes = {
    gene: PropTypes.string,
    description: PropTypes.string,
}

const initialState = { isLoading: false, results: [], value: '', source: [] }

export default class SearchExampleStandard extends Component {
    state = initialState
    get_data = async () => {
        const { data } = await axios.get("http://203.255.24.98:7890/Annotations/?format=json")
        this.setState({ source: data })
    }
    handleResultSelect = (e, { result }) => this.setState({ value: result.search_terms })

    handleSearchChange = (e, { value }) => {
        this.setState({ isLoading: true, value })
        console.log(this.state)
        setTimeout(() => {
            if (this.state.value.length < 1) return this.setState({ result: [] })
            const re = new RegExp(_.escapeRegExp(this.state.value), 'i')
            const isMatch = (result) => {
                return re.test(result.search_terms)
            }
            const get_filtered = () => _.filter(this.state.source, isMatch)
            const filtered = get_filtered();
            if (filtered.length < 100) {
                this.setState({
                    isLoading: false,
                    results: filtered,
                })
            } else {
                this.setState({
                    isLoading: false,
                    results: [{ search_terms: "Too many results" }],
                })
            }
        }, 300)
    }

    componentDidMount() {
        this.get_data()
    }

    render() {
        const { isLoading, value, results, source } = this.state
        return (
            <Container>
                <Grid columns={2}>
                    <Grid.Column width={6}>

                    </Grid.Column>
                    <Grid.Column width={6}>
                        <Search
                            size='huge'
                            placeholder="please type genename"
                            loading={isLoading}
                            onResultSelect={this.handleResultSelect}
                            onSearchChange={_.debounce(this.handleSearchChange, 500, {
                                leading: true,
                            })}
                            results={results}
                            value={value}
                            resultRenderer={resultRenderer}
                            {...this.props}
                        />
                    </Grid.Column>
                </Grid>

            </Container>

        )
    }
}