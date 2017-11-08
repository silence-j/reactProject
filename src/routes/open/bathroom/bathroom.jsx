import React from 'react';
import { connect } from 'dva';
import './bathroom.less';
import { NavLink } from 'dva/router';


class Bathroom extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      member: false
    }
  }
  render() {
    let userType = this.props.userType

    return (
      <div className="bathroom">
        {
          this.state.member ? 
          <div>
            <p className="title">您已购买精品团课，您将享受本次沐浴活动</p>
            <div className="open">
              <img src={require('../../../assets/xcool/erweima.png')} alt=""/>
            </div>
            <a href="/#/indexCool/open">
              <p className="being">成为X-COOL会员</p>
            </a>
            <p className="enjoy">享受更多优惠服务</p>
          </div> 
          : 
          (
             userType === 1 ? 
             <div className="qrcode-wraper">
              <div id="qrcode"></div>
            </div>
            :
             <div className="warning">
            <img className="warn-img" src={require('../../../assets/xcool/warn.png')} alt=""/>
            <p className="forbid">浴室门禁暂时未对非会员开放!</p>
            <NavLink to='/index/clubCard'>
              <p className="being">成为X-COOL会员</p>
            </NavLink>
            <p className="enjoy">享受更多优惠服务</p>
          </div>
          )
         
         
        }
      </div>
    );
  }
}

Bathroom.propTypes = {
};

export default connect()(Bathroom);
