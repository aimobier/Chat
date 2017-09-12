function getUrlParam(key) {
  // 获取参数
  var url = window.location.search;
  // 正则筛选地址栏
  var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
  // 匹配目标参数
  var result = url.substr(1).match(reg);
  //返回参数值
  return result ? decodeURIComponent(result[2]) : null;
}

var username = getUrlParam("username");
var headstrs = getUrlParam("headstrs");

if (username && headstrs) {

  var config = {
    syncURL: "https://spider.wilddogio.com/" //输入节点 URL
  };
  wilddog.initializeApp(config);
  var ref = wilddog.sync().ref();


  var qqMesRef = ref.child("qqmessage");


  $(".gunfucktext").hide();
  $(".backview").show();

  $(".tit").html(username);

  /*更新视图*/
  function upView(html) {
    $('.message').append(html);
    $('body').animate({
      scrollTop: $('.message').outerHeight() - window.innerHeight
    }, 200)
  }

  $(function() {
    $('.footer').on('keyup', 'input', function() {
      if ($(this).val().length > 0) {
        $(this).next().css('background', '#114F8E').prop('disabled', true);

      } else {
        $(this).next().css('background', '#ddd').prop('disabled', false);
      }
    });
    $('.footer p').click(function() {

							sendWillDogMessage();
    });

    $('.message_input_el').keyup(function(e) {
      if (e.which === 13) {

				sendWillDogMessage();

      }
    });

		function sendWillDogMessage(){
			qqMesRef.push({
				"username": username,
				"headstrs": headstrs,
				"content": $(".message_input_el").val(),
				"time": Date.parse(new Date())
			});

			$('.message_input_el').val('');
		}


    qqMesRef.on("child_added", function(snapshot) {

      addMessage(snapshot.val().username, snapshot.val().headstrs, snapshot.val().content, snapshot.val().time);
    });

  });


  function timeString(time) {
    var myDate = new Date(time);
    return "" + (myDate.getMonth() + 1) + "/" + myDate.getDate() + " " + myDate.getHours() + ":" + myDate.getMinutes();
  }

  function addMessage(uname, headSrc, content, timestr) {
    var style = username != uname ? "send" : "show";
    var html = "<div class='" + style + "'>";
    var time = $(".time:last").attr("unixtime");
    if (timestr && (!time || Math.abs(timestr-time) >= 1000*60*5 )) {
      html += "<div unixtime='"+timestr+"' class=\"time\">" + timeString(timestr) + "</div>";
    }
    html += "<div class=\"msg\">";
    html += "<img src='" + headSrc + "' alt='"+uname+"'>";
    html += "<p><i class=\"msg_input\"></i>" + content + "</p></div></div>";
    upView(html);
  }

} else {

  $(".gunfucktext").css('display', 'block');
  $(".backview").css('display', 'none');
}
