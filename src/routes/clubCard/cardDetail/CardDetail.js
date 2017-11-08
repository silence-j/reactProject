import React from 'react';
import { connect } from 'dva';
import qs from 'query-string'
import { Link } from 'dva/router';
import cardDetailAPI from '../../../services/cardDetailAPI'
import enCode from '../../../utils/enCode'
import './style.less';


class IndexPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      tit: '',
      yearCard: [
        { year: '一年卡', date: '有效期365天', time: 1 },
        { year: '三年卡', date: '有效期1095天', time: 3 },
        { year: '五年卡', date: '有效期1825天', time: 5 },
      ],
      
      member: '(99元/月+500元/年 会员费)',
      defualtYear: '一年卡',
      comment: '',
      id: '',
    }
  }


  componentDidMount() {
    document.title = '会员卡'
    localStorage.year = "一年卡"
    cardDetailAPI.getPrice({ type: qs.parse(this.props.location.search).type }).then(res => {
      let str1 ='',
          str2 = ''
      let data = res.data.data
      for (let index in data) {
        if (data[index].time === 1) {
          str1 = data[index].price
          str2 = data[index].oriPrice
        }
      }
      this.setState({
         tit: res.data.data[1].name,
         discount: str1,
         original: str2,
         comment: res.data.data[0].comment,
         id: res.data.data[0].id,
         detail: res.data.data[0].detail,
      })
        localStorage.money = this.state.discount
    })
  }

  toggle(item) {
    if (item.year !== this.state.yearCard.year) {
      this.setState({
        defualtYear: item.year,
      })
      localStorage.time = item.time
    }
    cardDetailAPI.getPrice({type: qs.parse(this.props.location.search).type}).then( res => {
      if ( item.year === "一年卡" ) {
        let str1 ='',
        str2 = ''
        let data = res.data.data
        for ( let index in data) {
          if ( data[index].time === 1 ) {
              str1 = data[index].price
              str2 = data[index].oriPrice
          }
        }
        this.setState({
          tit: res.data.data[1].name,
          discount: str1,
          original: str2,
          comment: res.data.data[0].comment,
          id: res.data.data[0].id,
          detail: res.data.data[0].detail,
        })
        localStorage.year = "一年卡"
        localStorage.money = this.state.discount
      } else if( item.year === "三年卡" ) {
        let str1 ='',
        str2 = ''
        let data = res.data.data
        for ( let index in data) {
          if ( data[index].time === 3 ) {
              str1 = data[index].price
              str2 = data[index].oriPrice
          }
        }
        this.setState({
          tit: res.data.data[1].name,
          discount: str1,
          original: str2,
          comment: res.data.data[1].comment,
          id: res.data.data[1].id,
          detail: res.data.data[1].detail,
        })
        localStorage.year = "三年卡"
        localStorage.money = this.state.discount
      }
      else if( item.year === "五年卡" ) {
        let str1 ='',
        str2 = ''
        let data = res.data.data
        for (let index in data) {
          if (data[index].time === 5) {
            str1 = data[index].price
            str2 = data[index].oriPrice
          }
        }
        this.setState({
          tit: res.data.data[1].name,
          discount: str1,
          original: str2,
          comment: res.data.data[2].comment,
          id: res.data.data[2].id,
          detail: res.data.data[2].detail,
        })
        localStorage.year = "五年卡"
        localStorage.money = this.state.discount
      }
    }) 
  }
  // 如果是情侣卡 跳转注册页面 如果个人卡且未注册 跳转登录 否则直接跳转购买页面
  buy() {
    let _this = this
    let type=qs.parse(this.props.location.search).type
    localStorage.source = 'card'
    localStorage.type = type
    if ( type === '2' || type === '3' ) {
      cardDetailAPI.getNumber().then((res) => {
        if( !res.data.data.phone ){
          _this.props.history.push('/loverLink')
        } else {
          _this.props.history.push('/anotherlover')
        }
      })
    } else if ( type === '0' || type === '1' ) {
      cardDetailAPI.getNumber().then((res) => {
        if( !res.data.data.phone  ){
          _this.props.history.push('/linkTo')
        } else {
          _this.props.history.push(`/payoff?id=${this.state.id}`)
        }
      })
    }
  }

  render() {
    return (
      <div className="club-card">
        <div className="top-pic">
          <img className="background-pic" src={require('../../../assets/image/fit.png')} alt="" />
          <img className="card-type" src={localStorage.pic} alt="" />
          <p className="title">{this.state.tit}</p>
        </div>
        <div className="year-card">
          <ul className="card-list"> {
            this.state.yearCard.map((item) => {
              return (<li className={`card-item ${item.year === this.state.defualtYear ? 'active' : ''}`} onClick={this.toggle.bind(this, item)} key={item.year} >
                <p>{item.year}</p>
                <span>{item.date}</span>
                { /* 点击当前选项 根据.active显示或隐藏 */ }
                {
                  item.year === this.state.defualtYear &&
                  (
                    <i className="triangle">
                      <i className="iconfont pitch">&#xe680;</i>
                    </i>
                  )
                }
              </li>)
            })
          }
          </ul>
        </div>
        <div className="privileges">
          <i className="iconfont crown">&#xe64e;</i>
          <h2>会员特权</h2>
        </div>
        <div className="notice" dangerouslySetInnerHTML={{__html: enCode(this.state.comment)}}>
        </div>
        <div className="foot">
          <div className="buy-price">
            <span className="discount">￥{this.state.discount/100}</span>
            <span className="original">￥{this.state.original/100}
              <em className="line" />
            </span>
            <p>{this.state.detail}</p>
          </div>
          <div className="buy-now" onClick={this.buy.bind(this)}>立即购买</div>
        </div>
      </div>
    );
  }
}

IndexPage.propTypes = {
};

export default connect()(IndexPage);
