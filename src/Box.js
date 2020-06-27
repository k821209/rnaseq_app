import React from 'react';
import axios from 'axios';
import { Chart } from "react-google-charts";
import { computeBoxplotStats } from 'react-boxplot';
import { Grid, Container, Table, Label, Header } from 'semantic-ui-react';


class Box extends React.Component {
    state = {
        isLoading: true,
        downExp: [],
        upExp: [],
        annot: [],
    };
    callExp = async (geneName) => {
        console.log(geneName)
        const { data: { 0: { down_exp } } } = await axios.get(`http://203.255.24.98:7890/Down_exp/?format=json&gene=${geneName}`)
        const { data: { 0: { up_exp } } } = await axios.get(`http://203.255.24.98:7890/Up_exp/?format=json&gene=${geneName}`)
        const { data } = await axios.get(`http://203.255.24.98:7890/Annotations/?format=json&gene=${geneName}`)
        this.setState({ isLoading: false, downExp: down_exp, upExp: up_exp, annot: data })
    }

    componentDidUpdate(prevProps, prevState) {
        console.log('didupdate1')
        console.log('#', prevProps)
        console.log('#', this.props)
        const { location, history } = this.props;
        //console.log(location.state.foodCd,prevLocation.state.foodCd)
        if (location !== prevProps.location) { // 이게 없으면 무한반복함. 같은 페이지의 어떤 움직임도 다 업뎃으로 인식하나봄. 
            if (location.state === undefined) {
                history.push("/");
            }
            else {
                const { location: { state: { gene } } } = this.props
                console.log(gene)
                this.callExp(gene)
            }
        }
    }

    get_exp2data = (array, color, initial) => {
        return array.map((each, ix) => ([initial + ix, each, color, null]))
    }

    componentDidMount() {
        const { history } = this.props;
        const { location: { state } } = this.props;
        if (state === undefined) {
            history.push("/");
        }
        else {
            const { location: { state: { gene } } } = this.props
            console.log(gene)
            this.callExp(gene)
        }
    }
    render() {
        const { geneName, isLoading, downExp, upExp, annot } = this.state;
        var upExpArray = upExp.toString().split(",").map(Number)
        if (isLoading === false) {
            upExpArray = upExpArray.slice(1, 3)
        }

        console.log(upExpArray)
        const downExpArray = downExp.toString().split(",").map(Number)
        const upExpArray2chart = this.get_exp2data(upExpArray, 'green', 'float')
        const dwExpArray2chart = this.get_exp2data(downExpArray, 'blue', 'drown')
        console.log([...upExpArray2chart, ...dwExpArray2chart])

        const allExp = upExpArray.concat(downExpArray)
        const upLabel = ['Floating']
        const downLabel = ['Drowning']
        const dwBox = computeBoxplotStats(downExpArray)
        const upBox = computeBoxplotStats(upExpArray)
        // const upData = upLabel.concat([dwBox.whiskerLow, dwBox.whiskerHigh, dwBox.quartile1, dwBox.quartile3])
        const upData = upLabel.concat([Math.min(...upExpArray), Math.max(...upExpArray), upBox.quartile1, upBox.quartile3])

        const downData = downLabel.concat([Math.min(...downExpArray), Math.max(...downExpArray), dwBox.quartile1, dwBox.quartile3])

        console.log(isLoading, upExpArray, downExpArray, upData, downData, annot, computeBoxplotStats(downExpArray))
        return (

            <div>
                {isLoading ? "Loading" :
                    <Container>
                        <Grid stackable columns={2}>
                            <Grid.Column width={6}>
                                <Header> Box plot </Header>
                                <Chart
                                    width={'100%'}
                                    height={350}
                                    chartType="CandlestickChart"
                                    loader={<div>Loading Chart</div>}
                                    data={[
                                        ['phase', 'a', 'b', 'c', 'd'],
                                        downData,
                                        upData,
                                    ]}
                                    options={{
                                        legend: 'none',
                                        seriesType: 'candlesticks',
                                        vAxis: { title: 'TPM', titleTextStyle: { italic: false } }
                                    }}
                                    rootProps={{ 'data-testid': '1' }}
                                />
                            </Grid.Column>
                            <Grid.Column width={8}>
                                <Header> Annotations </Header>
                                <Table fixed>
                                    <Table.Header>
                                        <Table.Row>
                                            <Table.HeaderCell>Class</Table.HeaderCell>
                                            <Table.HeaderCell>Information</Table.HeaderCell>
                                        </Table.Row>
                                    </Table.Header>
                                    <Table.Body>
                                        <Table.Row>
                                            <Table.Cell>GeneID</Table.Cell>
                                            <Table.Cell>{annot[0].gene}</Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.Cell>GeneName</Table.Cell>
                                            <Table.Cell>{annot[0].predicted_gene_name}</Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.Cell>Annotation</Table.Cell>
                                            <Table.Cell>{annot[0].eggnog_annot}</Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.Cell>Kegg_kos</Table.Cell>
                                            <Table.Cell>{annot[0].kegg_kos}</Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.Cell>GO_terms</Table.Cell>
                                            <Table.Cell>{annot[0].go_terms.split(',').join(', ')}</Table.Cell>
                                        </Table.Row>
                                    </Table.Body>
                                </Table>
                            </Grid.Column>
                            <Grid.Column>
                                <Chart
                                    width={'300px'}
                                    height={'300px'}
                                    chartType="ColumnChart"
                                    loader={<div>Loading Chart</div>}
                                    data={[
                                        [
                                            'Element',
                                            'Density',
                                            { role: 'style' },
                                            {
                                                sourceColumn: 0,
                                                role: 'annotation',
                                                type: 'string',
                                                calc: 'stringify',
                                            },
                                        ],
                                        ...dwExpArray2chart,
                                        ...upExpArray2chart,

                                    ]}

                                    options={{
                                        title: 'Density of Precious Metals, in g/cm^3',
                                        width: 600,
                                        height: 400,
                                        bar: { groupWidth: '95%' },
                                        legend: { position: 'none' },
                                    }}
                                    // For tests
                                    rootProps={{ 'data-testid': '6' }}
                                />
                            </Grid.Column>
                        </Grid>
                    </Container>
                }
            </div>



        )
    }
}

export default Box;
