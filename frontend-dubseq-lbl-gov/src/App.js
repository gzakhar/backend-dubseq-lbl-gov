import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import GraphPage from './components/Pages/Graphs/GraphsPage';
import HomePage from './components/Pages/Home/HomePage';
import About from './components/Pages/About/AboutPage';
import TablePage from './components/Pages/Table/TablePage';
import SearchPage from './components/Pages/Search/SearchPage';
import TestingPage from './components/Pages/Testing/TestingPage';
import ExperimentsPage from './components/Pages/Experiment/ExperimentsPage';
import GenePage from './components/Pages/Gene/GenePage';
import GenomePage from './components/Pages/Genome/GenomeList';
import GenomeLandingPage from './components/Pages/Genome/GenomeLandingPage';
import BagSeqLandingPage from './components/Pages/Library/BagSeqLandingPage';
import ExperiemntLandingPage from './components/Pages/Experiment/ExperimentLandingPage';
import GeneLandingPage from "./components/Pages/Gene/GeneLandingPage";


class App extends Component {
	render() {
		return (
			<Router>
				<Route exact path='/' component={HomePage} />
				<Route path='/graphs' component={GraphPage} />
				<Route path='/about' component={About} />
				<Route path='/listPage/:id' component={TablePage} />
				<Route path='/search' component={SearchPage} />
				<Route path='/testing' component={TestingPage} />
				<Route exact path='/organisms' component={GenomePage} />
				<Route strict path='/organisms/:id' component={GenomeLandingPage} />
				<Route path='/experiments' component={ExperimentsPage} />
				<Route exact path='/genes' component={GenePage} />
				<Route strict path='/genes/:id' component={GeneLandingPage} />
				<Route exact path='/bagseq/libraries/:id' component={BagSeqLandingPage} />
				<Route exact path='/bagseq/libraries/:id/experiments/:id_experiment' component={ExperiemntLandingPage} />
			</Router>
		);
	}
}

export default App;
