import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router'
import clubCardAPI from '../../services/clubCardAPI'
import './style.less';
import authInit from '../../utils/auth.js'


class ClubCard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      tit: '会员套餐',
      coolYearCard: '',
      type: [],
      pic: '',
    }
  }

  // 筛选time为1的卡
   componentDidMount() {
      document.title = '会员卡'

      authInit(window).then( res => {
        clubCardAPI.getCard().then( res => {
          let arr = []
          let pic
          let data = res.data.data
          for ( let index in data) {
            let item = data[index]
            for ( let index in item ) {
              if ( item[index].id == 1 ) {
                pic = require('../../assets/image/personalCard.png')
              } else if ( item[index].id == 4 ) {
                pic = require('../../assets/image/peopleCard.png')
              } else if ( item[index].id == 7 ) {
                pic = require('../../assets/image/loverCard.png')
              } else if ( item[index].id == 10 ) {
                pic = require('../../assets/image/loversCard.png')
              }
              if (item[index].time === 1 ) {
                arr.push({ id: item[index].id, name: item[index].name, price: item[index].price, oriPrice: item[index].oriPrice, type: item[index].type, pic: pic })
              } 
            }
          }
          this.setState({
            type: arr
          })
        })
      })
   }

   saveyear(item) {
     localStorage.name = item.name
     localStorage.id = item.id
     localStorage.pic = item.pic
   }

  render() {
    return (
      <div className="container">
        <div className="pic-show">
          <img className="background-pic" src={require('../../assets/image/cardbg.png')} alt="" />
          <img className="card" src={require('../../assets/image/clubCard.png')} alt="" />
        </div>
        <div className="combo">
          <h3>{this.state.tit}</h3>
          <ul className="card-list"> {
            this.state.type.map((item, index) => {
              return (
                <Link to={`/cardDetail?type=${item.type}`} key={index}>
                  <li className="card-item" onClick={this.saveyear.bind(this,item)} >
                    <img src={item.pic} alt="" />
                    <div className="card-content">
                      <span className="card-name">{item.name}</span>
                      <span className="year-card">X-COOL·年卡</span>
                    </div>
                    <div className="card-price">
                      <span className="newPrice">￥{item.price/100}</span>
                      <span className="oldPrice">￥{item.oriPrice/100}
                        <em className="line" />
                      </span>
                    </div>
                  </li>
                </Link>
              )
            })
          }
          </ul>
        </div>
      </div>
    )
  }
}

export default connect()(ClubCard);
