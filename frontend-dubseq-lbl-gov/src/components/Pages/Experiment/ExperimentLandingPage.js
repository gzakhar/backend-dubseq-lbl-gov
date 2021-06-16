import React, { useEffect, useState } from 'react'
import Aux from '../../../hoc/Aux';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import TableHorizontal from '../../UI/Table/TableHorizontal';
import Header from '../../UI/Header/Header';
import Content from '../../../hoc/Content/Content';
import Footer from '../../UI/Footer/Footer';
import Title from '../../UI/Title/Title';
import TableReact from '../../UI/Table/TableReact';


function ExperiemntLandingPage() {

	const { id, id_experiment } = useParams();
	const [stats, setStats] = useState(null);
	const [genes, setGenes] = useState(null);
	const [fragments, setFragments] = useState(null);

	useEffect(() => {
		async function fetchData() {
			let res1 = await axios(`/libraries/${id}/experiments/${id_experiment}/stats`);
			setStats(res1.data);
			
			let res2 = await axios(`/libraries/${id}/experiments/${id_experiment}/genes`);
			res2.data = addLink(res2.data, 'name', ['gene id'], '/genes/?')
			setGenes(res2.data);

			let res3 = await axios(`/libraries/${id}/experiments/${id_experiment}/fragments`);
			setFragments(res3.data);
		}
		fetchData();
	},[])

	// DESTINATION STRING MUST BE FORMATED CORRECTLY 
	// 'bagseq/libraries/?/experiments/?'
	function addLink(data, destLinkCol, idSrcCol, path) {
		return data.map(e => {
			let newPath = path;
			idSrcCol.forEach(id => {
				newPath = newPath.replace("?", e[id])
			})
			e[destLinkCol] = <Link to={newPath}>{e[destLinkCol]}</Link>;
			return e;
		})
	}

	let StatsLabels = [
		{
			dataField: 'name',
			text: 'Name',
		},
		{
			dataField: 'barseq_experiment_id',
			text: 'Experiment Id',
		},
		{
			dataField: 'itnum',
			text: 'ITnum',
		},
		{
			dataField: 'gene_count',
			text: 'Gene Count',
		},
		{
			dataField: 'fragment_count',
			text: 'Fragment Count',
		},
	]

	let topScoringGensLabels = [
		{
			dataField: 'name',
			text: 'Name',
			sort: true
		},
		{
			dataField: 'gene id',
			text: 'Gene ID',
			sort: true
		},
		{
			dataField: 'gene score',
			text: 'Gene Score',
			sort: true
		}
	]

	let topScoringFragments = [
		{
			dataField: 'barcode',
			text: 'Barcode',
			sort: true
		},
		{
			dataField: 'fragment id',
			text: 'Fragments Id',
			sort: true
		},
		{
			dataField: 'average score',
			text: 'Average Score',
			sort: true
		}
	]

	return (
		<Aux>
			<Header title='Experiment LandingPage' />
			<Content>
				<div className='container'>
					{stats && <Title title='Experiment' specific={stats[0]['name']} />}
					{stats && <TableHorizontal content={stats} labels={StatsLabels} title="General Information" />}
					<br />
					{/* {genes && <Table content={genes} title="Top Scoring Genes (top 20 highest scores)" />} */}
					{genes && <TableReact content={genes} keyField='gene id' labels={topScoringGensLabels} title="Top Scoring Genes (top 20 highest scores)" />}
					<br />
					{/* {fragments && <Table content={fragments} title="Top Scoring Fragments" />} */}
					{fragments && <TableReact content={fragments} keyField='fragment id' labels={topScoringFragments} title="Top Scoring Fragments" />}
				</div>
			</Content>
			<Footer />
		</Aux>
	)

}

export default ExperiemntLandingPage;