// Enrage Notifier

module.exports = function EnrageNotify(dispatch) {
    let max_hp;
    let current_hp;
    let percentage_hp;
    let next_enrage;
    let userName;
    let state = 1;
    let channelNumber = 11;
    let lastEvent = 0;
    let bosses = new Set();

    dispatch.hook('sLogin', (event) => {
      console.log("cid: " + event.cid);
      console.log("pid: " + event.pid);
      console.log("name: " + event.name);
      userName = "" + event.name;
    });

    dispatch.hook('sBossGageInfo', (event) => {
        //if(!(bosses.has("" + event.id))) console.log("adding " + event.id);
        bosses.add("" + event.id);
        max_hp = event.maxHp;
        current_hp = event.curHp;

        percentage_hp = Math.floor((current_hp / max_hp) * 100);

        next_enrage = (percentage_hp > 10) ? (percentage_hp - 10) : 0;
    });

    dispatch.hook('sNpcStatus', (event) => {

        if(!(bosses.has("" + event.creature))) return;


        if(event.enraged == 0 && lastEvent == 1){
            lastEvent = 0;
            var messageString = (next_enrage > 0) ? "** boss de-enraged, next enrage at " + next_enrage + "% **" : "** boss de-enraged **";
            if(state == 0) return;
            dispatch.toServer('cChat', {
                channel: channelNumber,
                message: messageString,
            });
        }

        if(event.enraged == 1 && lastEvent == 0){
            lastEvent = 1;

            if(state > 0)
            {
              dispatch.toServer('cChat', {
                  channel: channelNumber,
                  message: "** boss enraged - 36s **",
              });
            }

            setTimeout(
                function(){
                    if(!(bosses.has("" + event.creature)) || state == 0)
                      return;
                    dispatch.toServer('cChat', {
                        channel: channelNumber,
                        message: "** 10s left on enrage **",
                    });
                }, 26000);
        }
    });

    dispatch.hook('sDespawnNpc', (event) => {
      //if(bosses.delete("" + event.target)) console.log("deleting " + event.target);
      if(bosses.delete("" + event.target))
        lastEvent = 0;
    });

    dispatch.hook('sPrivateChat', (event) => {

      if(userName === ("" + event.authorName))
      {
        console.log("user ID is " + userName + " and authorID is " + event.authorID);
        if(event.message.includes("!notice"))
        {
          state = 2;
          channelNumber = 21;
        }
        else if(event.message.includes("!private"))
        {
          state = 1;
          var n = parseInt(event.message.replace( /[^\d.]/g, '' ));
          if(!isNaN(n) && n > 0 && n < 9)
            channelNumber = 10 + n;
          else {
            channelNumber = 11;
          }
        }
        else if(event.message.includes("!off"))
          state = 0;
        console.log("state changed to " + state);
        //channelNumber = (state == 2) ? 21 : 11;
      }

    });
}
