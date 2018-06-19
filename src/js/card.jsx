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
    }

    if (this.props.optionalConfigJSON) {
      stateVar.optionalConfigJSON = this.props.optionalConfigJSON;
    }

    this.state = stateVar;
  }

  exportData() {
    return this.props.selector.getBoundingClientRect();
  }

  componentDidMount() {
    if (this.state.fetchingData) {
      let items_to_fetch = [
        axios.get(this.props.dataURL)
      ];

      axios.all(items_to_fetch).then(axios.spread((card) => {
        let stateVar = {
          fetchingData: false,
          dataJSON: card.data,
          optionalConfigJSON:{},
          activeCounter:1
        };
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

  getNature(natures){
    return natures.join(', ')
  }
  
  renderTabContent(tab){
    let data = this.state.dataJSON.data;
    switch(tab){
      case 1:
        let summary = this.state.dataJSON.data.summary;
        summary = summary.substr(0,summary.indexOf(" ",183))+'....';
        console.log(summary)
        return(
            <div>
              <div className="half-width-parameter">
                <div className="single-parameter">
                  <div className="parameter-label">REASONS/NATURE OF LAND CONFLICT</div>
                  <p>{this.getNature(data.nature_of_land_conflict)}</p>
                </div>
                <div className="single-parameter">
                  <div className="parameter-label">SECTOR/TYPE OF INDUSTRY</div>
                  <p>{data.type_of_industry}</p>
                </div>
                <div className="single-parameter">
                  <div className="parameter-label">NO. OF HOUSEHOLD AFFECTED</div>
                  <p>{data.no_of_household_affected}</p>
                </div>
                <div className="single-parameter">
                  <div className="parameter-label">INVESTMENT (IN CRORES, Rs.)</div>
                  <p>{data.investment}</p>
                </div>
                <div className="single-parameter">
                  <div className="parameter-label">LAND AREA AFFECTED</div>
                  <p>{data.land_area_affected} acre</p>
                </div>
              </div>
              <div className="half-width-parameter">
                <div className="single-parameter">
                  <div className="parameter-label">VILLAGE/TOWN</div>
                  <p>{data.village}</p>
                </div>
                <div className="single-parameter">
                  <div className="parameter-label">DISTRICT</div>
                  <p>{data.district}</p>
                </div>
                <div className="single-parameter">
                  <div className="parameter-label">PROVINCE</div>
                  <p>{data.state}</p>
                </div>
                <div className="single-parameter">
                  <div className="parameter-label">STARTING YEAR</div>
                  <p>{data.year}</p>
                </div>
              </div>               
              <div className="single-parameter">
                <div className="parameter-label">Summary/Narrative</div>
                  <p>{summary}<a onClick={()=>this.selectTab(2)} style={{cursor:"pointer"}} >continue reading</a></p>
              </div>
            </div>
        )
        break;
      case 2:
        return(
            <div>
              <div className="half-width-parameter">
                <div className="single-parameter">
                  <div className="parameter-label">Parties involved</div>
                    <div className="parameter-small-label">State</div>
                    <p>{data.parties_involved_state}</p>
                    <div className="parameter-small-label">Corporate</div>
                    <p>{data.parties_involved_corporate}</p>
                    <div className="parameter-small-label">Community/Local organisations</div>
                    <p>{data.parties_involved_local}</p>
                    <div className="parameter-small-label">Others</div>
                    <p>{data.parties_involved_others}</p>
                </div>
              </div>
              <div className="half-width-parameter">
                  <div className="single-parameter">
                    <div className="parameter-label">Type of Land</div>
                    <p>{data.type_of_land}</p>
                  </div>
                  <div className="single-parameter">
                    <div className="parameter-label">Type of Common Land</div>
                    <p>{data.type_of_common_land}</p>
                  </div>
              </div>
              <div className="single-parameter">
                <div className="parameter-label">Major Human Rights Violations related to the conflict</div>
                <p>{data.major_human_rights_violation_related_to_conflict}</p>
              </div>
            </div>
        )
        break;
      case 3:  
        return(
          <p>
            {data.summary}
          </p>
        )
      case 4:
        return(
          <div>
            <div className="single-parameter">
              <div className="parameter-label">Source of information</div>
              <p>{data.source_of_information}</p>
            </div>
            <div className="single-parameter">
              <div className="parameter-label">Links</div>
              <p>
                {data.links}
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
      return (
        <div
          id="protograph_div"
          className="protograph-col7-mode">
          <div className="lcw-card">
            <div className="card-title">{data.name_of_conflict}</div>
            <div className="card-tabs">{this.renderTabs()}  </div>
            <div className="card-content">
              {this.renderTabContent(this.state.activeCounter)}
            </div>
            <div className="card-footer">
              <img src={'https://cdn.protograph.pykih.com/089131ca8ef9a3dcaad8/img/lcw-logo.png'}/>
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
          className="protograph-col4-mode">
          <div className="lcw-card lcw-card-mobile">
            <div className="tabContent">
            <div className="card-title card-title-mobile">{data.name_of_conflict}</div>
              <div className="card-tabs card-tabs-mobile">
              {this.renderTabs()}  
              </div>
              <div className="tab-content">
                  {this.renderTabContent(this.state.activeCounter)}
              </div>
            </div>  
              <div className="card-footer card-footer-mobile">
                <img src={'https://cdn.protograph.pykih.com/089131ca8ef9a3dcaad8/img/lcw-logo.png'}/>
              </div>
            </div>         
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
    }
  }
}
