import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Aux from '../../../hoc/Aux';
import Header from '../../UI/Header/Header';
import Footer from '../../UI/Footer/Footer';
import axios from 'axios';
import RadialGraph from '../../Graphs/RadialGraph';
import TableHorizontal from '../../UI/Table/TableHorizontal';
import HorizontalLayout from '../../Layouts/HorizontalLayout';
import Content from '../../../hoc/Content/Content';
import { Link } from 'react-router-dom';
import Title from '../../UI/Title/Title';
import TableReact from '../../UI/Table/TableReact';
import TablePaginatedExpand from '../../UI/Table/TablePaginatedExpand';
import Info from '../../UI/Info/InfoButton';
import { addUID } from '../../../helper/helperFunctions';

function GenomeLandingPage() {

	const { id } = useParams();
	const [stats, setStats] = useState(null);
	const [library, setLibrary] = useState([]);
	const [experiments, setExperients] = useState([]);

	useEffect(() => {

		const fetchData = async () => {
			// let res1 = await axios(`/api/organisms/${id}/stats`);
			let res1 = await axios.post('/v2/api/query/1', { "genome_id": parseInt(id) })
			setStats(res1.data);

			// let res2 = await axios(`/api/organisms/${id}/libraries`);
			let res2 = await axios.post('/v2/api/query/2', { "genome_id": parseInt(id) })
			res2.data = addLink(res2.data, 'name', ['bagseq_library_id'], `/bagseq/libraries/<>`)
			setLibrary(res2.data);

			// let res3 = await axios(`/api/organisms/${id}/topexperiments`);
			let res3 = await axios.post('/v2/api/query/4', { "genome_id": parseInt(id) })
			res3.data = addLink(res3.data, 'name', ['barseq_experiment_id'], `/bagseq/libraries/${id}/experiments/<>`)
			res3.data = addLink(res3.data, 'gene_name', ['barseq_experiment_id', 'gene_id'], `/graphs/fitness/?genome_id=${id}&experiment_id=<>&gene_id=<>`)
			res3.data = addUID(res3.data)
			setExperients(res3.data);
			// let res4 = await axios(`/api/organisms/${id}/graphs`);
			// setHistData(res4.data);
		}

		fetchData();
		console.log("Update");

		// eslint-disable-next-line
	}, [])


	// DESTINATION STRING MUST BE FORMATED CORRECTLY 
	// 'bagseq/libraries/?/experiments/?'
	function addLink(data, destLinkCol, idSrcCol, path) {
		return data.map(e => {
			let newPath = path;
			idSrcCol.forEach(id => {
				newPath = newPath.replace("<>", e[id])
			})
			e[destLinkCol] = <Link to={newPath}>{e[destLinkCol]}</Link>;
			return e;
		})
	}


	let StatsLabels = [
		{
			dataField: 'name',
			text: 'Name'
		},
		{
			dataField: 'genome_id',
			text: 'ID'
		},
		{
			dataField: 'size',
			text: 'Size (kbps)'
		},
		{
			dataField: 'ncbi_taxonomy_id',
			text: 'TaxonomyId'
		},
		{
			dataField: 'phylum',
			text: 'Phylum'
		},
		{
			dataField: 'gene_count',
			text: 'Gene Count'
		},
		{
			dataField: 'experiment_count',
			text: 'Experiment Count'
		},
		{
			dataField: 'condition_count',
			text: 'Condition Count'
		},
	]

	let LibrariesLabels = [
		{
			dataField: 'name',
			text: 'Name',
			sort: true
		},
		{
			dataField: 'bagseq_library_id',
			text: 'Id',
			sort: true
		},
		{
			dataField: 'experiments_count',
			text: 'Experiments',
			sort: true
		},
		{
			dataField: 'fragment_count',
			text: 'Fragments',
			sort: true
		},
	]

	let TopPerformingLabels = [
		{
			dataField: 'name',
			text: 'Name',
			sort: true
		},
		{
			dataField: 'type',
			text: 'Type',
			sort: true
		},
		{
			dataField: 'gene_name',
			text: 'Gene',
			sort: true
		},
		{
			dataField: 'max_gene_score',
			text: 'MaxGeneScore',
			sort: true
		}
	]

	let genomeName = stats ? stats[0]['name'] : ''

	let expandRowFunction = (row, row_ind) => {
		let genome_id = stats[0]['genome_id']
		let experiment_id = row['barseq_experiment_id']
		let gene_id = row['gene_id']
		return (
			<div style={{ minHeight: '100px' }}>
				<Link className='btn btn-primary'
					to={`/graphs/fitness/?genome_id=${genome_id}&experiment_id=${experiment_id}&gene_id=${gene_id}`}>
					Fitness Graphs
				</Link>
			</div>
		)
	}



	return (
		<Aux>
			<Header title={'GenomeLandingPage'} />
			<Content>
				<div className='container' style={{ paddingBottom: "40px" }}>
					{stats && <Title title={'Organism'} specific={genomeName} />}
					{stats && <HorizontalLayout content={[
						<TableHorizontal content={stats} labels={StatsLabels} title='General Information' />,
						<RadialGraph />
					]} contentWidth={[6, 6]} />}
					<div style={{ marginTop: "50px" }}>
						<h4 style={{ fontWeight: "700", marginBottom: "30px" }}>Libraries Created</h4>
						<Info />
						<TableReact content={library} keyField='id' labels={LibrariesLabels} />
					</div>

					<div style={{ marginTop: "70px" }}>
						<h4 style={{ fontWeight: "700", marginBottom: "30px" }}>Top Experiments Performed</h4>
						<TablePaginatedExpand data={experiments} keyField='uid' columns={TopPerformingLabels} expandRowFunction={expandRowFunction} />
					</div>

				</div>
			</Content>
			<Footer />
		</Aux>
	)
}

export default GenomeLandingPage;