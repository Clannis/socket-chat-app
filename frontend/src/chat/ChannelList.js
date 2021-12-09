import React from 'react';
import { Channel } from './Channel';

export class ChannelList extends React.Component {

    handleClick = id => {
        this.props.onSelectchannel(id)
    }

    render() {
        let list = <div className='no-content-message'>There are no channels to show.</div>;
        if(this.props.channels && this.props.channels.map) {
            list = this.props.channels.map( c => <Channel key={c.id} id={c.id} name={c.name} participants={c.participants} onClick={this.handleClick}/>)
        }

        return(
            <div className="channel-list">
                {list}
            </div>
        )
    }
}