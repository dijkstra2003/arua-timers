import React from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';
import { faHistory } from '@fortawesome/free-solid-svg-icons';
import { update } from '../../actions/monster/update';

class MonsterCard extends React.Component {
    constructor(props) {
        super(props);
        
        this.resetTimer = this.resetTimer.bind(this);
    }
    resetTimer() {
        var { id, name, respawnTime, lastSpawn, map } = this.props.monster;
        lastSpawn = moment().utcOffset(+120).format('YYYY-MM-DDTHH:mm:ss');
        this.props.update({"@id": "/api/monsters/" + id},{id, name, respawnTime, lastSpawn, map})
        this.props.reRender();
    }

    render() {
        return(
            <div className="col-12  col-md-6 mt-3">
                <div className="card monster-card">
                    <div className="card-body">
                        <div className="row">
                            <div className="col-10">
                                <div className="title">{this.props.monster['name']}</div>
                                next boss: {
                                    moment(this.props.monster['lastSpawn'])
                                    .add(-4, 'hour')
                                    .add(moment(this.props.monster['respawnTime']).get('hour'), 'hour')
                                    .add(moment(this.props.monster['respawnTime']).get('minute'), 'minute')
                                    .add(moment(this.props.monster['respawnTime']).get('second'), 'second')
                                    .format('HH:mm:ss, MMMM Do')
                                }
                            </div>
                            <div className="col-2 reset" onClick={this.resetTimer}>
                                <FontAwesomeIcon icon={faHistory}/>
                            </div>
                        </div> 
                    </div>
                </div>
            </div>
        )
    }
}

const mapDispatchToProps = {
    update,
};

const mapStateToProps = state => ({
    updated: state.monster.update.updated
});

export default reduxForm({
    form: 'Login'
})(connect(mapStateToProps, mapDispatchToProps)(MonsterCard));

