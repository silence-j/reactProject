import React from 'react';
import { connect } from 'dva';
import './joiner.less'

class ActiveDetail extends React.Component {
  constructor (props) {
    super(props)
    
  }
  componentDidMount () {
    
  }
  
  render() {
    let joiners = this.props.joiner.slice(0,6)
    return (
       
      <div className="heads-wrap">
        {
        joiners.map( (item,index) => {
            return (
              <div className="head-wrap" key={index} >
                <img className="joiner-head" src={item.avatar} />
                <div className="head-name">{item.nickName}</div>
              </div>  
            )
        })
       }
       {
        joiners.length === 6 ? <div className="more">...</div>: ''
       }
      </div>
       
    )
  }
}

ActiveDetail.propTypes = {
};

export default connect()(ActiveDetail);
