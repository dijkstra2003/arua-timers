import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { list, reset } from '../../actions/monster/list';
import './dashboard.css';
import MonsterCard from './monster-card';

class Dashboard extends React.Component {
  static propTypes = {
        retrieved: PropTypes.object,
        loading: PropTypes.bool.isRequired,
        error: PropTypes.string,
        eventSource: PropTypes.instanceOf(EventSource),
        deletedItem: PropTypes.object,
        list: PropTypes.func.isRequired,
        reset: PropTypes.func.isRequired
    };

    componentDidMount() {
        this.props.list(
          this.props.match.params.page &&
            decodeURIComponent(this.props.match.params.page)
        );
      }
    
      componentWillReceiveProps(nextProps) {
        if (this.props.match.params.page !== nextProps.match.params.page)
          nextProps.list(
            nextProps.match.params.page &&
              decodeURIComponent(nextProps.match.params.page)
          );
      }
    
      componentWillUnmount() {
        this.props.reset(this.props.eventSource);
      }

      renderLinks = (type, items) => {
        if (Array.isArray(items)) {
          return items.map((item, i) => (
            <div key={i}>{this.renderLinks(type, item)}</div>
          ));
        }
      }

      triggerRender() {
        window.location.reload();
      }

      render() {
          return(
              <div className="row m-0">
                  {this.props.retrieved &&
                  this.props.retrieved['hydra:member'].map(item => (
                    <MonsterCard 
                      monster={item} 
                      key={item['@id']}
                      reRender={() => { this.triggerRender()} }
                    />
                  ))}           
              </div>
          )
      }    

}

const mapStateToProps = state => {
    const {
      retrieved,
      loading,
      error,
      eventSource,
      deletedItem
    } = state.monster.list;
    return { retrieved, loading, error, eventSource, deletedItem };
};
  
const mapDispatchToProps = dispatch => ({
    list: page => dispatch(list(page)),
    reset: eventSource => dispatch(reset(eventSource))
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);