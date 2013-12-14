var express = require('express')//エクスプレスをインポート
  , routes = require('./routes')//
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');
var app = express();//アプリケーションオブジェクト


app.configure(function(){//アプリケー主恩の編集
  app.set('port', process.env.PORT || 8080);//ポートを設定
  app.set('views', __dirname + '/views');
  app.use(express.static(__dirname + '/static'));
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(express.cookieParser('secret', 'sample'));
  app.use(express.session());
   app.use(app.router);
});



app.configure('development', function(){
  app.use(express.errorHandler());
});




app.get('/users', user.list);




server = http.createServer(app); // appを指定にしてサーバーを作る。
//http.createServer(app).listen(app.get('port'), function(){ // del
	
server.listen(app.get('port'), function(){ //app.setで設定したポートで待ち受け。
  console.log("Express server listening on port " + app.get('port'));
});

// add start
var socketIO = require('socket.io');
// クライアントの接続を待つ(IPアドレスとポート番号を結びつけます)
var io = socketIO.listen(server);//appで作ったサーバーにsocketIOを結びつける


app.use(express.bodyParser());
app.use(express.methodOverride());



app.post('/app.js',function(req,res)
{
	console.log(req.body)
	
}

)

memberNumber=new Array(5);//メンバーの数を格納する配列

for (var i=1;i<5;i++){//各部屋の人数を０人で初期化
	memberNumber[i]=0;
	
}

votecount=0;

roomnumber="0";//部屋番と名前は先に仮のものを入れておく。
name="仮";

CalPoint = new Array(50);//採点結果を格納する
//投稿してきたユーザーの名前を格納
loginuser=new Array(1);
postcount=0;//ゲームのポスト数
loginuser1=new Array(1);
loginuser2=new Array(1);
loginuser3=new Array(1);
loginuser4=new Array(1);
var allClients = [];//ソケットをキーとしてユーザー名を入れる連想配列
var allroomClients1 = [];//ソケットをキーとして部屋番号を入れる連想配列
var allroomClients2 = [];
var allroomClients3 = [];
var allroomClients4 = [];
len =30;
for(var i = 0; i < len; i++){
	CalPoint [i] = [i];
	for(var j = 0; j < len; j++){
		CalPoint [i][j] = '';
	}}
var gamecheck=0;



app.get("/room1", function(req, res){//要求されたアドレス（部屋番号）に応じてレンダリングするテンプレを変える。
	name = req.param("username");
	loginuser1.push(name);
	console.log("room1です");
	roomnumber="1";
	memberNumber[1]++; 
  res.render('index',{username:name,roomnumber:"1",memnum:memberNumber[1],});
});
  




app.get("/room2", function(req, res){
	name = req.param("username");
   roomnumber="2";
   loginuser2.push(name);
   console.log("/room2での"+roomnumber);
    memberNumber[2]++;
    res.render('index',{username:name,roomnumber:"2",memnum:memberNumber[2],});
});

app.get("/room3", function(req, res){
name = req.param("username");
loginuser3.push(name);
	 roomnumber="3";
	 memberNumber[3]++;
    res.render('index',{username:name,roomnumber:"3",});

});

app.get("/room4", function(req, res){
	name = req.param("username");
	loginuser4.push(name);
     roomnumber="4";
      memberNumber[4]++;
    res.render('index',{username:name,roomnumber:"4",});
});


app.get("/", function(req, res){
    res.render('login',{memberNumber1:memberNumber[1],memberNumber2:memberNumber[2],memberNumber3:memberNumber[3],memberNumber4:memberNumber[4],});
});




// クライアントが接続してきたときの処理
io.sockets.on('connection', function(socket) {
	var clients = {};
	clients[socket.id] = socket;//接続してきたidと今操作しているsocketを紐づける。これをしておかないと繋がっているクライアント全員にログイン処理が送信される
	 var socket2=clients[socket.id];
	 
if(roomnumber==1){//部屋番号が１なら。
  socket2.emit('enter1',{value:name,roomnum:"1",});
}else if(roomnumber==2)
{
	socket2.emit('enter2',{value:name,roomnum:"2",});
	
}
else if(roomnumber==3)
{
	socket2.emit('enter3',{value:name,roomnum:"3",});
	
}
else{
	socket2.emit('enter4',{value:name,roomnum:"4",});
	
	
}


 　 socket.on('userenter1', function(data) {//ログイン処理
        console.log("１にjoin");
        socket.join("1");//1にログイン
        allClients[socket]=data.username;//ソケットをキーとしてユーザー名を格納する
        allroomClients1[socket]="1";//ソケットをキーとして部屋番号を格納する。
        io.sockets.to("1").emit('userenter', { value:data.username,loginuser:loginuser1,gamecheck:gamecheck});//ログインしたことを知らせるメソッドを呼び出す

    });  

 socket.on('userenter2', function(data) {//メッセージイベントを送るイベント
        console.log("2にjoin");

        allClients[socket]=data.username;//ソケットをキーとしてユーザー名を格納する
        allroomClients1[socket]="2";
        socket.join("2");
         io.sockets.to("2").emit('userenter', { value:data.username,loginuser:loginuser2,gamecheck:gamecheck});
    });
    
  socket.on('userenter3', function(data) {//メッセージイベントを送るイベント
        allClients[socket]=data.username;//ソケットをキーとしてユーザー名を格納する
        allroomClients1[socket]="3";
        socket.join("3");
        io.sockets.to("3").emit('userenter', { value:data.username,loginuser:loginuser3,gamecheck:gamecheck});
    
    });
    
 socket.on('userenter4', function(data) {//メッセージイベントを送るイベント
 	    
        allClients[socket]=data.username;//ソケットをキーとしてユーザー名を格納する
        allroomClients1[socket]="4";
        socket.join("4");
        io.sockets.to("4").emit('userenter', { value:data.username,loginuser:loginuser4,gamecheck:gamecheck});

    
    });

 socket.on('enter', function() {//メッセージイベントを送るイベント
 	
    io.sockets.emit('enter',{value:name});    
    });



  socket.on('message', function(data) {//メッセージイベントを送るイベント
  	var roomnumber;
    // つながっているクライアント全員に送信

    //データに入っているバリューを全員に送信。これによってクライアント側のメッセージイベントが起動。
    var toroomnum=data.roomnum; //部屋番号
    var message=data.value //messageの中身
    var postusername=data.username; //投稿してきたユーザーの名前
     io.sockets.to(toroomnum).emit('clientmessage', { value: message,username:postusername, });
  });








 socket.on('start', function(data) {//ゲームがスタートしたことを知らせるメソッド
    // つながっているクライアント全員に送信
    console.log("odaidesu");
    //データに入っているバリューを全員に送信。これによってクライアント側のメッセージイベントが起動。
    var odai=data.value;
    console.log(data.value);
    io.sockets.to(data.roomnum).emit('start',{value:odai});
    
    });


 socket.on('timer', function(data) {//タイマーを作動させる。
 	
    io.sockets.to(data.roomnum).emit('timer');
    
    });

 

 socket.on('votetime', function(data) {//投票用のタイマー
    var roomnum=data.roomnum;
    io.sockets.to(roomnum).emit('clientvotetime');
    
    });

 socket.on('sumpoints',function(mark){//ユーザーから送られてきた投票データを集計する
 	console.log("ネタを投稿したユーザーの名前"+mark.name);

 	var markusername=mark.name;//採点されたネタの投稿者のの名前
 	var markpoints=mark.points-0;//得点を一旦数にする
 	var currentroomnum=mark.roomnum;//部屋番号
 	votecount++;//投票回数を増やす
 	console.log("ユーザーから送られてきた得点"+markpoints);
 	console.log("足し算する前の得点"+CalPoint[markusername]);
    CalPoint[markusername]=CalPoint[markusername]+markpoints;//ユーザーネームをキーとして、得点を入れる配列に加算する
 	  console.log("合計得点"+CalPoint[markusername]);

 	  	var usernamelength=postusernamearray.length;//投稿してきたユーザーの数を図る
console.log("長さは"+usernamelength);

if((postcount*postcount)==votecount){//投稿してきたユーザーの数と投票数が同数なら。
 	  	for(var i=1;i<usernamelength;i++)
 	  	{
             console.log("これ何回？");
 	 var resulttable="<tr><td>"+postusernamearray[i]+"</td><td>"+userpost[postusernamearray[i]]+"</td><td>"+CalPoint[postusernamearray[i]]+"</td>"
 	        console.log("resultテーブルです"+resulttable+"結果は？");
 	  		io.sockets.to(currentroomnum).emit('showresult',{result:resulttable,roomunum:mark.roomnum});//結果を表示するメソッド
 	  		gamecheck=0;//初期化しておく
 	  	}
}
 	  
 	  
 });
    
socket.on('initialize', function(data) {//初期化処理
     console.log("イに者");
     postcount=0;
     votecount=0;
     postusernamearray=new Array(1);
     userpost=new Array(79);//ユーザーの投稿を格納する用
      gamecheck="1";//ゲーム中
     io.sockets.to(data.roomnum).emit('clientinitialize');//クライアント側の初期化処理
     
 });
 
 socket.on('showanswerform', function(data) { //投票フェームを送信するためのメソッド
 	console.log("showanserform");
    var roomnum=data.roomnum;
    var username=data.username;//投稿者のユーザーネームを入れる
    postusernamearray.push(data.username);//ユーザーネームを配列に格納
    postcount++;//投稿数をカウント
    submitanswer=data.value+"</br><p id='"+username+"'><input type='radio' id='"+username+"check1' name='vote"+username+"' value='1' checked='checked'>1<input type='radio' id='"+username+"check2' name='vote"+username+"' value='3'>3<input type='radio' id='"+username+"check3' name='vote"+username+"' value='5'>5<br></p>";
    CalPoint[username]=0;//ユーザーネームをキーとして初期の得点を追加
    userpost[username]=data.value;//ユーザーの投稿をユーザーネームをキーとして格納
    io.sockets.to(roomnum).emit('clientanswerform',{value:submitanswer,username:data.username,});//クライアントに投稿されてきたデータを送る
    
    });

  socket.on('userdelete', function(data){//ログアウト時の処理。ログインしているユーザー一覧から削除する

  if(data.roomnum=="1"){
  	
  	for(var i=1;i<loginuser1.length;i++)
  	if(loginuser1[i]=data.value){
  		
  		loginuser1.splice(i,1);
  	}
  	
  }else if(data.roomnum=="2")
  {
  		
  	for(var i=1;i<loginuser2.length;i++)
  	if(loginuser2[i]=data.value){
  		
  		loginuser2.splice(i,1);
  	}
  }
  else if(data.roomnum=="3")
  {
  		
  	for(var i=1;i<loginuser3.length;i++)
  	if(loginuser3[i]=data.value){
  		
  		loginuser3.splice(i,1);
  	}
  	
  	
  }
  else{
  		
  	for(var i=1;i<loginuser4.length;i++)
  	if(loginuser4[i]=data.value){
  		
  		loginuser4.splice(i,1);
  	}
  	
  }
  
  
  

  });

  // クライアントが切断したときの処理
  socket.on('disconnect', function(){
    memberNumber[allroomClients1[socket]]--;//メンバー数を減らす
  　　io.sockets.to(allroomClients1[socket]).emit('userlogout',{value:allClients[socket],});//ログアウトした事を知らせるメソッドを起動。
  
    if( memberNumber[allroomClients1[socket]]==0)//もし最後にログインしているユーザーがログアウトしたら、配列を空にする
    {
    	if(allroomClients1[socket]==1){
    		
    		loginuser1.length=0;
    		loginuser1[0]=null;
    		
    	}else if(allroomClients1[socket]==2){
    		loginuser2.length=0;
    		loginuser2[0]=null;
    	}
    	else if(allroomClients1[socket]==3){
    		loginuser3.length=0;
    		loginuser3[0]=null;
    	}
    	else {
    		loginuser4.length=0;
    		loginuser4[0]=null;
    		
    	}
    	
    }
  });
});

