/**时间格式转换 */
function formatTimeForPlan(time){
  let seconds=0;
  let minutes=0;
  let hours=0;
  let days=0;
  if(time){
    seconds=time;
    if(seconds>59){
      minutes=Math.floor(seconds/60);
      seconds=seconds%60;
      if (minutes > 59) {
        hours = Math.floor(minutes / 60);
        minutes = minutes % 60;
        if (hours > 23) {
          days = Math.floor(hours / 24);
          hours = hours % 24;
        }
      }
    }
  }
  let ds = days > 9 ? days : `0${days}`;
  let hs=hours>9?hours:`0${hours}`;
  let ms = minutes > 9 ? minutes : `0${minutes}`;
  let ss = seconds > 9 ? seconds : `0${seconds}`;
  return [ds.toString(), hs.toString(), ms.toString(), ss.toString()];
};
let t='';
/**倒计时实现 */
function countDown(that){
  let seconds=that.data.seconds;
  if(seconds===0){
    that.setData({
      seconds:0,
      clock:formatTimeForPlan(0)
    })
    that.getplandetail(0);
    return;
  }
  t=setTimeout(()=>{
    that.setData({
      seconds: seconds-1,
      clock: formatTimeForPlan(seconds - 1)
    });
    countDown(that);
  },1000)
}
/**停止倒计时 */
function clearTimeOut(){
  clearTimeout(t);
}