import React from 'react';
import { connect } from 'dva';
import { NavLink } from 'dva/router'
import { Icon, Rate } from 'antd'
import { Modal } from 'antd-mobile'
import Carsouel from './carousel/carsouel'
import DetailMsg from './detailMsg/detailMsg'
// import CourseProcess from './courseProcess/courseProcess'
import './courseDetail.less';
import {dateFormat, TimeSec, fenToYuan} from '../../utils/dateFormat'
import courseAPI from '../../services/courseAPI.js'
import enCode from '../../utils/enCode.js'
import Loading from '../../components/Loading/Loading'
import NoData from '../../components/nodata/nodata'
import qs from 'query-string'
import teacherinfo from '../../services/teacherAPI'


class CourseDetail extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      detailList: {},
      coachDetail: {},
      msg:[],
      isData: false,
      isShowMore: false,
      showMore: false,
      isLoading: true,
      timeOver: false,
      str: '日一二三四五六',
      //  购买状态 0：未购买 1：已购买排队中 2：已购买且预约成功
      buyState: ''
      
    }
   }
  
  componentDidMount () {
  	
  	
    document.title = '团课详情'
    let param = {scheduleId: qs.parse(this.props.location.search).id}
    this.getDetailList(param)
  }

  getDetailList(param) {
    this.setState({
      isLoading: true,
      isData: false
    })
    courseAPI.getCourseDetail(param).then(res => {
      if (res.data.code === 0) {
        if (res.data.data !== null && res.data.data !== undefined && res.data.data !== {}) {
          let data = res.data.data
          data.description = enCode(data.description)
          data.content = enCode(data.content)
          // 判断是否开课前半小时
          let now = Date.parse(new Date())
          let startTime = data.startTime
          let timeOver = ((Number(startTime) - now) / 1000 / 60) > 30 ? false : true
          this.setState({
            isLoading: false,
            detailList: data,
            timeOver,
            buyState: data.buyStatus
          })
          this.coach()
          this.getMsg()
        } else {
          this.setState({
            isLoading: false,
            isData: true
          })
        }
      }
    })
  }
  getMsg () {
    courseAPI.getMsgComment({type: 0, id: this.state.detailList.courseId}).then(res => {
      if(!res.data.code) {
          this.setState({
            msg: res.data.data.records
          })
      }
    })
  }
  coach () {
    courseAPI.getCoachDetail({id: this.state.detailList.coachId}).then((res) => {
      if (res.data.code === 0) {
        this.setState({
          coachDetail: res.data.data
        })
        if (this.state.coachDetail.description.length > 60 ) {
          this.setState({
            isShowMore: true
          })
        } else {
          this.setState({
            isShowMore: false
          })
        }
      }
    })
  }
  //预约
  bespeak () {
    if (this.state.timeOver) {
      return
    }
    courseAPI.getUserInfo().then((res) => {
      if(res.data.code === 0) {
        if (res.data.data.phone === null || res.data.data.phone === '' || res.data.data.phone === undefined ) {
          this.props.history.push({
            pathname: '/login',
            search: `?which=course&id=${this.state.detailList.scheduleId}&type=${res.data.data.userType}&virtualBalance=${res.data.data.virtualBalance}`
          })
        } else {
          this.props.history.push({
            pathname: '/payment',
            search: `?which=course&id=${this.state.detailList.scheduleId}&type=${res.data.data.userType}&virtualBalance=${res.data.data.virtualBalance}`
          })
        }
      }
    })
  }
    //取消预约
  cancelOrder () {
    if (this.state.timeOver) {
      return
    }
    Modal.alert('确定要取消预约吗？', '', [{ text: '取消', onPress: () => {
      console.log('点击了取消')
    } }, { text: '确定', onPress: () => {
      console.log('点击了确认')
      this.confrimCancel()
    } }])
  }
  confrimCancel () {
    let params = {
      type: 0,
      id: this.state.detailList.scheduleId
    }
    courseAPI.cancelOrder(params).then((res) => {
      if(!res.data.code){
        let param = {scheduleId: qs.parse(this.props.location.search).id}
        this.getDetailList(param)
      }
    })
  }
  showMore (val) {
    if (val === 'down') {
      this.setState(
        {
          showMore: true
        }
      )
    } else {
      this.setState(
        {
          showMore: false
        }
      )
    }

  }
  render() {
    return (
      <div className={`D-container ${this.state.buyState === 3 && this.state.evalStatus === 1 ? '' : 'padding-b'}`}>
        {
          this.state.isLoading ? <Loading top="15"></Loading> : (
            <div>
              {
                this.state.isData ? <NoData source="course"></NoData> : (
                  <div>
                    {/*轮播图*/}
                    <Carsouel banner={this.state.detailList.banner}></Carsouel>
                    {/*限时狂欢*/}
                    <div className="time-limit">
                      <img className="time-img" src={require('../../assets/image/xcool.png?x-oss-process=image/resize,h_72')} alt=""/>
                      <p className="limit">{this.state.detailList.name}</p>
                      {/*<p className="start">*/}
                      <Rate className="start" disabled allowHalf defaultValue={this.state.detailList.score} />
                      {/*</p>*/}
                      <p className="info time"><em className="iconfont icon-size">&#xe610;</em>{dateFormat(this.state.detailList.startTime).substr(5).replace('-', '.')}(周{this.state.str[new Date(dateFormat(this.state.detailList.startTime)).getDay()]})/{TimeSec(this.state.detailList.startTime)}~{TimeSec(this.state.detailList.endTime)}</p>
                      <p className="info address"><em className="iconfont icon-size">&#xe60f;</em>{this.state.detailList.address}</p>
                      <p className="info count">
                        <span>已约 {this.state.detailList.orderNum}/{this.state.detailList.planNum}</span>
                        <span className="money"><em>￥</em>{fenToYuan(this.state.detailList.price)}</span>
                      </p>
                      <p className="prince"><span>(会员价: {fenToYuan(this.state.detailList.memberPrice)}元)</span></p>
                    </div>
                    {/*教练信息*/}
                    <div className="coach-info">
                      {
                        this.state.coachDetail.photo !== null && this.state.coachDetail.photo !== '' ? <img src={this.state.coachDetail.photo} alt=""/> : <img src={require('../../assets/defaultAvtar.png')} alt=""/>
                      }
                      <div className="coach-name">{this.state.detailList.coachName}
                        <Rate character={<Icon type="heart" />}  allowHalf disabled defaultValue={this.state.detailList.score} />
                      </div>
                      <p className="good-at">
                        擅长:
                        <span> {this.state.coachDetail.goodAt}</span>
                      </p>
                      <p className="good-at">
            <span className={this.state.showMore ? 'allField' : 'field'}>资质:
              <span> {this.state.coachDetail.description}</span>
            </span>
                      </p>
                      {
                        this.state.isShowMore ? (
                          <p className="showMore">
                            {this.state.showMore ? <Icon type="up" onClick={this.showMore.bind(this, 'up')}></Icon> : <Icon type="down" onClick={this.showMore.bind(this, 'down')}></Icon>}
                          </p>
                        ) : ''
                      }
                    </div>
                    {/*课程流程*/}
                    <div className="course">
                      <p className="course-name">课程简介</p>
                      <p  className={`x-cool howLine1 ${this.state.detailList.tag !== '' ? '' : ''}`}
                          dangerouslySetInnerHTML={{__html: this.state.detailList.content}}
                      >
                      </p>
                      {
                        this.state.detailList.tag === '' ? '' : (
                          <div className="label">
                            {
                              this.state.detailList.tag.split('|').map((item, index) => {
                                return (<span key={index}>{item}</span>)
                              })
                            }
                          </div>
                        )
                      }
                      {/*流程*/}
                      <div className="description" dangerouslySetInnerHTML={{__html: this.state.detailList.description}}>
                      </div>
                    </div>
                    {/*留言板*/}
                    <div className="msg-board">
                      <DetailMsg  msg={this.state.msg}></DetailMsg>
                      {/*{*/}
                      {/*this.state.msg.map((item, index) => {*/}
                      {/*return <DetailMsg key={index} msg={item}></DetailMsg>*/}
                      {/*})*/}
                      {/*}*/}
                    </div>
                    {
                      this.state.buyState === 3 && this.state.evalStatus === 1 ? '' : (
                        <div>
                          {
                            this.state.buyState === 1 || this.state.buyState === 2 ? (
                              <button className={`order ${this.state.timeOver ? 'disable' : ''}`} onClick={this.cancelOrder.bind(this)}>取消预约</button>
                            ) : (
                              <button className={`order ${this.state.timeOver ? 'disable' : ''}`} onClick={this.bespeak.bind(this)}>预约</button>
                            )
                          }
                        </div>
                      )
                    }

                  </div>
                )
              }
            </div>
          )
        }
      </div>
    )
  }
}

CourseDetail.propTypes = {
};

export default connect()(CourseDetail);
