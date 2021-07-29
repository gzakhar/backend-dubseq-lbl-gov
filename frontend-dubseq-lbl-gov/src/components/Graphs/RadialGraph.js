import React, { useEffect, useState } from 'react'
import GenomeRadialD3 from '../D3Components/GenomeRadialD3'
import axios from 'axios';

function RadialGraph(props) {

	const [data, setData] = useState(null);

	useEffect(() => {

		async function fetchData() {

			let res = await axios.post('/v2/api/query/29', {
				'window': 10000,
				'genome_id': parseInt(props.libraryId)
			});

			res.data = res.data.map(row => ({x: row['position'], y: row['fragment_count']}))

			setData(res.data);
		}

		fetchData();
	}, [])



	return (
		<GenomeRadialD3 content={data} title={props.title} />
	)
}

export default RadialGraph;