import React, { Component } from 'react';
import Aux from '../../../hoc/Aux';
import Header from '../../UI/Header/Header';
import Footer from '../../UI/Footer/Footer';
import Card from '../../UI/Card/Card';
import Content from '../../../hoc/Content/Content';
// import HomePageCarousel from '../../UI/HomePageCarousel/HomePageCarousel2';

import "./HomePage.css";

class HomePage extends Component {

	render() {
		return (
			<Aux>
				<Header title='DubSeq Browser' />
				{/* <HomePageCarousel /> */}
				<div className="home-page-main-content-wrapper">
					<Content>

						<div className='container main-content-wrapper'>
							<div className='row'>
								<div className='col-7'>
									<h2>Browse Organisms</h2>
									<p style={{ color: "#272727", fontSize: '20px', fontWeight: '250', marginTop: "15px" }}>As a demonstration of this approach, we generate an Escherichia coli (E. coli) Dub-seq library and assayed the phenotypic consequences of overexpressing nearly all genes on E. coli fitness under dozens of experimental conditions.</p>
								</div>
								<div className='col-5'>
									<Card title='Organisms' image={'/images/genome.svg'} link='/organisms' />
								</div>
							</div>
							<hr style={{ margin: '5rem' }} />
							<div className='row'>
								<div className='col-5'>
									<Card title='Experiments' image={'/images/experiment.svg'} link='/experiments' />
								</div>
								<div className='col-7'>
									<h2>Browse Experiments</h2>
									<p style={{ color: "#272727", fontSize: '20px', fontWeight: '250', marginTop: "15px" }}>In these pooled fitness experiments, the barcode abundance changes depending upon the fitness pheno-type imparted by the barcode-associated genome fragments.</p>
								</div>
							</div>
							<hr style={{ margin: '5rem' }} />
							<div className='row'>
								<div className='col-7'>
									<h2>Browse Genes</h2>
									<p style={{ color: "#272727", fontSize: '20px', fontWeight: '250', marginTop: "15px" }}>We show that Dub-seq yields gene fitness data that is consistent with known biology and also provides novel gene function insights. We vali- date some of these new findings by overexpressing individual genes and quantifying these strains fittness.</p>
								</div>
								<div className='col-5'>
									<Card title='Genes' image={'/images/gene.svg'} link='/genes' />
								</div>
							</div>
						</div>


					</Content>
				</div>
				<Footer />
			</Aux>
		)
	}
}

export default HomePage;