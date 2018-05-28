import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

export default class toCard extends React.Component {

  constructor(props) {
    super(props)
    let stateVar = {
      fetchingData: true,
      dataJSON: {},
      optionalConfigJSON: {},
      languageTexts: undefined,
      siteConfigs: this.props.siteConfigs,
      activeCounter : 1
    };

    if (this.props.dataJSON) {
      stateVar.fetchingData = false;
      stateVar.dataJSON = this.props.dataJSON;
      stateVar.languageTexts = this.getLanguageTexts(this.props.dataJSON.data.language);
    }

    if (this.props.optionalConfigJSON) {
      stateVar.optionalConfigJSON = this.props.optionalConfigJSON;
    }

    this.state = stateVar;
  }

  exportData() {
    return document.getElementById('protograph_div').getBoundingClientRect();
  }

  componentDidMount() {
    if (this.state.fetchingData) {
      let items_to_fetch = [
        axios.get(this.props.dataURL)
      ];

      if (this.props.siteConfigURL) {
        items_to_fetch.push(axios.get(this.props.siteConfigURL));
      }

      axios.all(items_to_fetch).then(axios.spread((card, site_configs) => {
        let stateVar = {
          fetchingData: false,
          dataJSON: card.data,
          optionalConfigJSON:{},
          siteConfigs: site_configs ? site_configs.data : this.state.siteConfigs,
          activeCounter :1
        };

        stateVar.dataJSON.data.language = stateVar.siteConfigs.primary_language.toLowerCase();
        stateVar.languageTexts = this.getLanguageTexts(stateVar.dataJSON.data.language);
        this.setState(stateVar);
      }));
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.dataJSON) {
      this.setState({
        dataJSON: nextProps.dataJSON
      });
    }
  }

  getLanguageTexts(languageConfig) {
    let language = languageConfig ? languageConfig : "hindi",
      text_obj;

    switch(language.toLowerCase()) {
      case "hindi":
        text_obj = {
          font: "'Sarala', sans-serif"
        }
        break;
      default:
        text_obj = {
          font: undefined
        }
        break;
    }

    return text_obj;
  }

  selectTab(tab){
    this.setState({activeCounter:tab+1});
  }

  renderTabs(){
      let tabs =['overview','details','narrative','sources'];
      let tabNames;
      
      tabNames = tabs.map((card,i)=>{
      let tabClass;
      tabClass = (this.state.activeCounter == i+1)  ? ((this.state.mode == "col-7")?"single-tab active":"single-tab single-tab-mobile active") : ((this.state.mode == "col-7")?"single-tab":"single-tab single-tab-mobile");
      return(
          <div key={i.toString()} className={tabClass} style={{cursor:"pointer"}} onClick={()=>this.selectTab(i)}>{tabs[i]}</div>
      )
      });
      return tabNames;
  }
  
  renderTabContent(tab){

    switch(tab){
      case 1:
        let overview = this.state.dataJSON.data.Overview;
        let summary = this.state.dataJSON.data.Narrative.substr(0,this.state.dataJSON.data.Narrative.indexOf('.')+1)+'....';
        return(
            <div>
                <div className="half-width-parameter">
                    <div className="single-parameter">
                        <div className="parameter-label">REASONS/NATURE OF LAND CONFLICT</div>
                        <p>{overview.reasons}</p>
                    </div>
                    <div className="single-parameter">
                        <div className="parameter-label">SECTOR/TYPE OF INDUSTRY</div>
                        <p>{overview.sector}</p>
                    </div>
                    <div className="single-parameter">
                        <div className="parameter-label">NO. OF HOUSEHOLD AFFECTED</div>
                        <p>{overview.noHouseholds}</p>
                    </div>
                    <div className="single-parameter">
                        <div className="parameter-label">INVESTMENT (IN CRORES, Â‚_)</div>
                        <p>{overview.investment}</p>
                    </div>
                    <div className="single-parameter">
                        <div className="parameter-label">LAND AREA AFFECTED</div>
                        <p>{overview.landArea} acre</p>
                    </div>
                </div>
                <div className="half-width-parameter">
                    <div className="single-parameter">
                        <div className="parameter-label">VILLAGE/TOWN</div>
                        <p>{overview.village}</p>
                    </div>
                    <div className="single-parameter">
                        <div className="parameter-label">DISTRICT</div>
                        <p>{overview.village}</p>
                    </div>
                    <div className="single-parameter">
                        <div className="parameter-label">PROVINCE</div>
                        <p>{overview.province}</p>
                    </div>
                    <div className="single-parameter">
                        <div className="parameter-label">STARTING YEAR</div>
                        <p>{overview.startYear}</p>
                    </div>
                </div>
                
                <div className="single-parameter">
                    <div className="parameter-label">Summary/Narrative</div>
                        <p>{summary}<a onClick={()=>this.selectTab(2)}>Continue reading</a></p>
                </div>
            </div>
        )
        break;
      case 2:
        let detail = this.state.dataJSON.data.Details;
        return(
            <div >
                <div className="half-width-parameter">
                    <div className="single-parameter">
                        <div className="parameter-label">Parties involved</div>
                        <div className="parameter-small-label">State</div>
                        <p>{detail.parties.state}</p>
                        <div className="parameter-small-label">Corporate</div>
                        <p>{detail.parties.corporate}</p>
                        <div className="parameter-small-label">Community/Local organisations</div>
                        <p>{detail.parties.local}</p>
                        <div className="parameter-small-label">Others</div>
                        <p>{detail.parties.others}</p>
                    </div>
                </div>
                <div className="half-width-parameter">
                    <div className="single-parameter">
                        <div className="parameter-label">Type of Land</div>
                        <p>{detail.landtype}</p>
                    </div>
                    <div className="single-parameter">
                        <div className="parameter-label">Type of Common Land</div>
                        <p>{detail.commanLandType}</p>
                    </div>
                </div>
                <div className="single-parameter">
                    <div className="parameter-label">Major Human Rights Violations related to the conflict</div>
                    <p>{detail.HRViolation}</p>
                </div>
            </div>
        )
        break;
      case 3:  
        let narrative = this.state.dataJSON.data.Narrative;
        return(
            <p>
                {narrative}
            </p>
        )
      case 4:
        let sources = this.state.dataJSON.data.Sources;
        return(
            <div>
                <div className="single-parameter">
                    <div className="parameter-label">Links</div>
                    <p>{sources.links}</p>
                </div>
                <div className="single-parameter">
                    <div className="parameter-label">Sources of information</div>
                    <p>
                        <a href="">{sources.sources}</a>
                    </p>
                </div>
            </div>
        )    
    } 

  }

  renderCol7() {
    let data = this.state.dataJSON.data;
    if (this.state.fetchingData ){
      return(<div>Loading</div>)
    }
    else {
      console.log(data.explore_url) 
      return (
        <div
          id="protograph_div"
          className="protograph-col7-mode"
          style={{ fontFamily: this.state.languageTexts.font }}>
          {/* content */}
          <div className="lcw-card">
                <div className="card-title">{data.title}</div>
                <div className="card-tabs">
                {this.renderTabs()}  
                </div>
                <div >
                    {this.renderTabContent(this.state.activeCounter)}
                </div>
                <div className="card-footer">
                    <img src={'./src/images/lcw-logo.png'}/>
                    <a href={data.explore_url}><div className="call-to-action-button">Click here to explore data</div></a>
                </div>
            </div>         
        </div>
      )
    }
  }

  renderCol4() {
    if (this.state.fetchingData) {
      return (<div>Loading</div>)
    } else {
      let data = this.state.dataJSON.data;
      return (
        <div
          id="protograph_div"
          className="protograph-col4-mode"
          style={{ fontFamily: this.state.languageTexts.font }}>
          {/* content */}
          <div
          id="protograph_div"
          className="protograph-col7-mode"
          style={{ fontFamily: this.state.languageTexts.font }}>
          {/* content */}
          <div className="lcw-card lcw-card-mobile">
            <div className="tabContent">
            <div className="card-title card-title-mobile">{data.title}</div>
              <div className="card-tabs card-tabs-mobile">
              {this.renderTabs()}  
              </div>
              <div className="tab-content">
                  {this.renderTabContent(this.state.activeCounter)}
              </div>
            </div>  
              <div className="card-footer card-footer-mobile">
                  <img src={'./src/images/lcw-logo.png'}/>
                  <a href={data.explore_url}><div className="call-to-action-button call-to-action-button-mobile">Click here to explore data</div></a>
              </div>
            </div>         
          </div>
        </div>
      )
    }
  }

  renderCol3() {
    if (this.state.fetchingData) {
      return (<div>Loading</div>)
    } else {
      return (
        <div
          id="protograph_div"
          className="protograph-col3-mode"
          style={{ fontFamily: this.state.languageTexts.font }}>
            {/* content */}
        </div>
      )
    }
  }

  render() {
    switch(this.props.mode) {
      case 'col7' :
        return this.renderCol7();
        break;
      case 'col4':
        return this.renderCol4();
        break;
      case 'col3' :
        return this.renderCol3();
        break;
    }
  }
}
