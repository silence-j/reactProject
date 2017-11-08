import React from 'react';
import { connect } from 'dva';
import myClubCard from '../../../../services/myClubCardAPI.js'
import enCode from '../../../../utils/enCode'
import { turnYMD } from '../../../../utils/dateFormat'
import './style.less';

class MyClubCard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: {},
      relationdata: {},
      cardPic:'',
      comment: '',
      cardName: '',
      cardType: '',
      pic: '',
      relationPic: '',
      nick: '',
      relationNick: '',
      phone: '',
      relationPhone: '',
      startTime: '',
      endTime: ''
    }
  }

  componentDidMount() {
    document.title = '我的会员卡'
    myClubCard.getCard().then( res => {
      let data = res.data.data
      let user = data.user
      let relationUser = data.relationUser || {}
      console.log(data)
      let cardName
      let cardPic
      if ( data.cardType === 0 ) {
        cardName = '个人基础卡'
        cardPic = require('../../../../assets/image/personalCard.png')
      } else if ( data.cardType === 1 ) {
        cardName = '个人组合卡'
        cardPic = require('../../../../assets/image/peopleCard.png')
      } else if ( data.cardType === 2 ) {
        cardName = '情侣基础卡'
        cardPic = require('../../../../assets/image/loverCard.png')
      } else if ( data.cardType === 3 ) {
        cardName = '情侣组合卡'
        cardPic = require('../../../../assets/image/loversCard.png')
      } 
      this.setState({
        comment: data.comment,
        cardName: cardName,
        cardType: data.cardType,
        pic: user.avatar,
        relationPic: relationUser.avatar || null,
        nick: user.nickName,
        relationNick: relationUser.nickName || null,
        phone: user.phone,
        relationPhone: relationUser.phone || null,
        startTime: data.startTime,
        endTime: data.endTime,
        cardPic: cardPic,
      })
    })
  }

  render() {
    return (
      <div className="container">
        <div className="top-pic">
          <img className="background-pic" src={require('../../../../assets/image/fit.png')} alt="" />
          <img className="card-type" src={this.state.cardPic} alt="" />
          <p className="title">{this.state.cardName}</p>
        </div>
        {
          (this.state.cardType == 2 || this.state.cardType == 3) &&
          (<div className="lovers">
          <h2><i className="iconfont">&#xe61a;</i>情侣会员</h2>
          <div className="lovers-info">
            <div className="lovers-pic">
              <img src={this.state.pic} alt="" />
              <img src={this.state.relationPic} alt="" />
            </div>
            <div className="lovers-content">
              <p><span>{this.state.nick}</span>{this.state.phone}</p>
              <p><span>{this.state.relationNick}</span>{this.state.relationPhone}</p>
            </div>
          </div>
        </div>)
        }
        
        <div className="sever">
          <h2>会员服务</h2>
          <div dangerouslySetInnerHTML={{__html: enCode(this.state.comment)}} />
        </div>
        <div className="useful-time">
          <h2 className="useful-content">有效期</h2>
          <p className="useful-date">{turnYMD(this.state.startTime)}~{turnYMD(this.state.endTime)}</p>
        </div>
      </div>
    )
  }
}

export default connect()(MyClubCard);
