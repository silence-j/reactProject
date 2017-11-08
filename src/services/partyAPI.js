import request from '../utils/request.js'

var partyObj = {
  getParties(code) {
    return request.get('/xcool/social/activity/list')
  }
} 

export default partyObj