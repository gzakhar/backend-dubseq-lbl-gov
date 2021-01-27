import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Aux from '../../../hoc/Aux';
import Header from '../../UI/Header/Header';
import Footer from '../../UI/Footer/Footer';
import axios from 'axios';
import Table from '../../UI/Table/Table';
import Histogram from '../../D3Components/Histogram';
import TableHorizontal from '../../UI/Table/TableHorizontal';
import Content from '../../../hoc/Content/Content';

function BagSeqLandingPage() {

	const { id } = useParams();
	const [stats, setStats] = useState(null);
	const [experiments, setExperients] = useState(null);
	const [topPerformingGenes, setTopPerformingGenes] = useState(null);

	useEffect(() => {

		const fetchData = async () => {
			let res1 = await axios.get(`/api/bagseq/${id}/stats`);
			setStats(res1.data);
			let res2 = await axios.get(`/api/bagseq/${id}/experiments`);
			setExperients(res2.data);
			let res3 = await axios.get(`/api/bagseq/${id}/maxperforminggene`);
			setTopPerformingGenes(res3.data);
		}

		fetchData();
		console.log("Update");
	}, [])

	return (
		<Aux>
			<Header title='Library LandingPage' />
			<Content>
				<div className='container'>
					{stats && <h1 style={{margin: '25px 0px 50px 0px', borderBottom: 'solid 2px black'}}>BAGSeq Library - <span style={{color: 'red', fontWeight: 300}}>{stats[0]['Name:']}</span></h1>}
					{stats && <TableHorizontal content={stats} title='General Information' />}
					<br/>
					{experiments && <Table content={experiments} title='Experiments (high scoring genes - genes scored above 4)' />}
					<br/>
					{topPerformingGenes && <Table content={topPerformingGenes} title='Top Performing Genes' />}
					<Histogram />
				</div>
			</Content>
			<Footer />
		</Aux>
	)
}

export default BagSeqLandingPage;