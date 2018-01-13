import React, { Component } from 'react';
import axios from 'axios';

import StyledTotalWorkingTime from './TotalWorkingTime.style';
import WorkingHours from '../../components/WorkingHours.component';
import Rectangle from '../../components/Rectangle.component';
import LinkButton from '../../components/LinkButton.component';

/* eslint-disable import/no-webpack-loader-syntax */
import docSVG from '-!svg-react-loader!../../assets/doc.svg';
/* eslint-enable import/no-webpack-loader-syntax */

import { calcTime, convertTimeZone } from '../../utils/date';
import { apiEndpoint, botMessengerUrl } from '../../constants/config.constant';

class TotalWorkingTime extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accuHrs: 0,
      accuMins: 0,
      accuSecs: 0,
      nCurrentWorking: 0,
    }
  }
  componentDidMount() {
    this.getCurrentTotalWorkTime();
    this.getCurrentWorking();
  }

  // 取得已經打卡下班的時間總長度
  getCurrentTotalWorkTime = () => {
    // 假如使用者系統設定不在時區 UTC+8，會轉換成 UTC+8 的時間，讓取得年月日的時候正確。
    const now = convertTimeZone(new Date(), 8);
    const params = {
      year: now.getFullYear(),
      month: now.getMonth(),
      day: now.getDate(),
    };
    const url = `${apiEndpoint}/api/check-ins/total-work-time`;
    axios.get(url, { params }).then(response => {
      const { accuHrs, accuMins, accuSecs } = response.data;
      this.setState({
        accuHrs: this.state.accuHrs + parseInt(accuHrs, 10),
        accuMins: this.state.accuMins + parseInt(accuMins, 10),
        accuSecs: this.state.accuSecs + parseInt(accuSecs, 10),
      });
    });
  }

  // 取得現在還在上班的人數，並加上到目前為止累積的時間長度
  getCurrentWorking = () => {
    const url2 = `${apiEndpoint}/api/check-ins/working`;

    axios.get(url2).then(response => {
      const { accuHrs, accuMins, accuSecs } = this.calcWorkTimeByStartTime(response.data);
      this.setState({
        accuHrs: this.state.accuHrs + accuHrs,
        accuMins: this.state.accuMins + accuMins,
        accuSecs: this.state.accuSecs + accuSecs,
        nCurrentWorking: response.data.length,
      })
    });
  }

  calcWorkTimeByStartTime = (checkIns) => {
    const nowTime = new Date().getTime();
    return checkIns.reduce((accuTime, checkIn) => {
      const { hrs, mins, secs } = calcTime(nowTime - new Date(checkIn.startTime).getTime());
      return {
        accuHrs: accuTime.accuHrs + hrs,
        accuMins: accuTime.accuMins + mins,
        accuSecs: accuTime.accuSecs + secs,
      }
    }, { accuHrs: 0, accuMins: 0, accuSecs: 0 });
  }

  render() {
    const { accuHrs, accuMins, accuSecs, nCurrentWorking } = this.state;
    return (
      <StyledTotalWorkingTime>
        <h1 className="title">
          今天，全台灣的勞工已經製造了...
        </h1>
        <div className="circle">
          <WorkingHours
            accuHrs={accuHrs}
            accuMins={accuMins}
            accuSecs={accuSecs}
            nCurrentWorking={nCurrentWorking}
          />
        </div>
        <div className="end-text">
          的功德
        </div>
        <hr />
        <div className="call-to-action">
          <h3 className="cta-text">
            快來一起投入做功德的行列吧！ 台灣的經濟需要你！
          </h3>
          <div className="cta-button-container">
            <LinkButton href={botMessengerUrl} alt="馬上開始使用" className="cta-button"> 開始做功德 </LinkButton>
          </div>
          <hr />
          <h3 className="leave-your-data-text">
            或者是
          </h3>
          <div className="leave-your-data">
            <Rectangle
              SVGIcon={docSVG}
              title='分享你的職場現況'
              content='讓台灣其他人知道，你的工時有多長？ 被雇主如何對待？'
              href='https://www.goodjob.life/share'
            />
          </div>
        </div>
      </StyledTotalWorkingTime>
    );
  }
}

export default TotalWorkingTime;
