import React from 'react';
import { connect } from 'dva';
import { Route } from 'dva/router';
import { NavLink } from 'dva/router'
import Lunbo from './carousel/carsouel.jsx'
import './style.less';
import partyAPI from '../../../../services/partyAPI.js'
import authInit from '../../../../utils/auth.js'

import { dateFormat, fenToYuan } from '../../../../utils/dateFormat'
import Loading from '../../../../components/Loading/Loading'


class IndexPage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      parties: [],
      isLoading: false
    }
    
  }
  componentDidMount () {
    document.title = '活动列表'
    this.setState({
      isLoading: true
    })
    authInit(window).then( res => { 
      partyAPI.getParties().then( res => {
        if (!res.data.code) {
          this.setState({
            isLoading:false,
            parties: res.data.data.records
          })
        }
      })
    })
  }
  //跳转公司详情
  jumpToDetail (id) {
    this.props.history.push({
      pathname: '/activeDetail',
      search: `?id=${id}`
    })
  }
  render() {
    return (
      <div className="active-view">
        {
          this.state.isLoading === false ? (
            <div>
              <Lunbo banner={this.state.parties}></Lunbo>
              <ul className="content-box">
                {
                  this.state.parties.map( (item,index) => {
                    let stateDom;
                    if (item.status === 1) {
                      stateDom = <div className="sign-up"><span>报名中</span></div>
                    } else if (item.status === 0) {
                      stateDom = <div className="to-expect"><span>敬请期待</span></div>
                    } else if (item.status === 2) {
                      stateDom = <div className="sign-up"><span>排队中</span></div>
                    } else if (item.status === 5) {
                      stateDom = <div className="ended"><span>已结束</span></div>
                    }
                    return (
                      <li className="content-one" key={index} onClick={this.jumpToDetail.bind(this, item.id)}>
                        <div className="pic">
                          {stateDom}
                          {
                            item.cover !== null && item.cover !== '' ? <img src={item.cover}/> : <img src={require('../../../../assets/defaultCarsouel.png?x-oss-process=image/resize,h_120')}/>
                          }
                        </div>
                        <div className="content-bottom">
                          <h3>{item.title}</h3>
                          <p>{item.summary|| '暂无活动介绍'}</p>
                          <ul>
                            <i className="iconfont time1">&#xe610;</i>
                            <span>{dateFormat(item.startTime)}</span>
                            <i className="iconfont address1">&#xe60f;</i>
                            <span>{item.address}</span>
                          </ul>
                        </div>
                      </li>
                    )
                  })

                }


              </ul>
            </div>
          ):(
            <Loading top="15"></Loading>
          )
        }

      </div>
    );
  }
}

IndexPage.propTypes = {
};

export default connect()(IndexPage);
