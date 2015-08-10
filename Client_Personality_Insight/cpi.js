
function getClientName()
	{
	var name="";
	var profile=Session.get("clientProfile");
	if (profile!=null)
		name=profile.name;
	return name;
	}

function resizeCanvas() {
	var c = document.getElementById("p-photos");
	c.width = window.innerWidth;//*.986;
	c.height = window.innerHeight/4;  //25%
	buildGraph();
	}

function drawOval(context,x,y,radius,color,lineWidth)
	{
	var ovalRatio=0.85;
	context.save();
	context.scale(ovalRatio,1); //make it an oval
	context.beginPath();
	context.arc(x/ovalRatio,y,radius,0,2*Math.PI);
	context.restore();
	context.strokeStyle=color;
	context.lineWidth = lineWidth;
	context.stroke();	
	}

function drawClientPicture()
	{
	var c = document.getElementById("p-photos");
	var ctx = c.getContext("2d");

	var fatLineWidth=c.height*0.1;	
	var x=c.width-c.width/6.7;
	var y=c.height*.44;
	var r=(c.height*.66)/2;
	var w=r*2-fatLineWidth;
	var h=w;
	ctx.drawImage(clImage,x-w/2,y-h/2,w,h);
	drawSummarySection(Session.get("bpProfile"),Session.get("clientProfile"));
	}

function badClientPicture()
	{
	
	}

function drawBpPicture()
	{
	var c = document.getElementById("p-photos");
	var ctx = c.getContext("2d");

	var fatLineWidth=c.height*0.1;	
	var x=c.width/6.7;
	var y=c.height*.44;
	var r=(c.height*.66)/2;
	var w=r*2-fatLineWidth;
	var h=w;
	ctx.drawImage(bpImage,x-w/2,y-h/2,w,h);
	drawSummarySection(Session.get("bpProfile"),Session.get("clientProfile"));
	}

function badBpPicture()
	{
	
	}

function drawBpDots()
	{
	var profile=Session.get("bpProfile");
	console.log(profile);
	console.log(profile.score);
	if (profile!=null)
		{
		drawDot("cautiouscurious",profile.score.cautiouscurious,bpDot);
		drawDot("organizedeasygoing",profile.score.organizedeasygoing,bpDot);
		drawDot("outgoingreserved",profile.score.outgoingreserved,bpDot);
		drawDot("sensitiveconfident",profile.score.sensitiveconfident,bpDot);
		drawDot("caringanalytical",profile.score.caringanalytical,bpDot);
		}
	}

function drawClDots()
	{
	var profile=Session.get("clientProfile");
	console.log(profile);
	console.log(profile.score);
	if (profile!=null)
		{
		drawDot("cautiouscurious",profile.score.cautiouscurious,clDot);
		drawDot("organizedeasygoing",profile.score.organizedeasygoing,clDot);
		drawDot("outgoingreserved",profile.score.outgoingreserved,clDot);
		drawDot("sensitiveconfident",profile.score.sensitiveconfident,clDot);
		drawDot("caringanalytical",profile.score.caringanalytical,clDot);
		}
	}

function drawDot(canvas,value,image)
	{
	var c = document.getElementById(canvas);
	var ctx = c.getContext("2d");
	var size=c.height*.75;
	var y=(c.height-size)/2;
	ctx.drawImage(image,c.width*(value/100),y,size,size);
	}

if (Meteor.isClient) {
	var bpImage=new Image(200,200);
	var clImage=new Image(200,200);
	var bpDot=new Image(20,20);
	var clDot=new Image(20,20);
	
	Session.set("score",67);
	Session.set("bpProfile",{"name":"Jim Hoskins", 
									"photo":"images/jim.jpg",
									"twitterId":"jimhoskins",
									"score":{"cautiouscurious":10,
											 "organizedeasygoing":20,
											 "outgoingreserved":30,
											 "sensitiveconfident":60,
											 "caringanalytical":87}});
	Session.set("clientProfile",{"name":"John Koshins", 
										"photo":"images/scream.gif",
										"twitterId":"johnkoshins",
										"score":{"cautiouscurious":40,
												 "organizedeasygoing":30,
												 "outgoingreserved":35,
												 "sensitiveconfident":22,
												 "caringanalytical":50}});
	
	Session.set('pageNumber',1);
	window.addEventListener('resize', resizeCanvas, false);
	
	function buildGraph()
		{
		if (comparePageNums(2))
			{
			//get the images loading
			bpDot.src="images/partnercircle.png";
			clDot.src="images/clientcircle.png";
			bpDot.onload=drawBpDots;
			clDot.onload=drawClDots;
			bpImage.src=Session.get("bpProfile").photo;
			bpImage.onload=drawBpPicture;
			bpImage.onerror=badBpPicture;
			clImage.src=Session.get("clientProfile").photo;
			clImage.onload=drawClientPicture;
			clImage.onerror=badClientPicture;
			var bpProfile=Session.get("bpProfile");
			var clientProfile=Session.get("clientProfile");
			drawSliders(bpProfile,clientProfile);
			}
		}
	
	/*
	 * Draws the sliders with the dots
	 */
	function drawSliders(bpProfile,clientProfile)
		{
		console.log(bpProfile.score.cautiouscurious);
		drawSlider("cautiouscurious");
		drawSlider("organizedeasygoing");
		drawSlider("outgoingreserved");
		drawSlider("sensitiveconfident");
		drawSlider("caringanalytical");
		}
	
	/*
	 * Draws a slider with the dots
	 */
	function drawSlider(canvas,partner,client)
		{
		var c = document.getElementById(canvas);
		c.height=25;
		var ctx = c.getContext("2d");
		ctx.beginPath();
		ctx.strokeStyle="#9AA5A9";
		ctx.lineCap="round";
		ctx.lineWidth=4;
		ctx.moveTo(c.width/20,c.height/2-0.5);
		ctx.lineTo(c.width-(c.width/20),c.height/2-0.5);
		ctx.stroke();
		}
	
	/*
	 * Draws the section with the photos and summary
	 */
	function drawSummarySection(bpProfile,clientProfile)
		{
		//set up some variables to draw the ovals
		var c = document.getElementById("p-photos");
		var ctx = c.getContext("2d");

		var clientColor="#09afeb";
		var bpColor="#8dc53e";
		var thinLineColor="white";
		var fatLineWidth=c.height*0.1;
		var thinLineWidth=1;

		// BP picture circle
		var x=c.width/6.7;
		var y=c.height*.44;
		var r=(c.height*.66)/2;
		//get rid of the photo corners
		drawOval(ctx,x,y,r+fatLineWidth,"white",fatLineWidth);
		//the thick oval
		drawOval(ctx,x,y,r,bpColor,fatLineWidth);
		//the thin white line in the oval
		drawOval(ctx,x,y,r,thinLineColor,thinLineWidth);
		
		// Client picture circle
		//get rid of the photo corners
		drawOval(ctx,c.width-x,y,r+fatLineWidth,"white",fatLineWidth);
		//the thick oval
		drawOval(ctx,c.width-x,y,r,clientColor,fatLineWidth);
		//the thin white line in the oval
		drawOval(ctx,c.width-x,y,r,thinLineColor,1);
		
		//draw the line between the circles
		// do the wide BP line
		ctx.beginPath();
		ctx.moveTo(x+r,y);
		ctx.lineTo(c.width/2,y); //stop in the center
		ctx.strokeStyle=bpColor;
		ctx.lineWidth=fatLineWidth;
		ctx.stroke();
		//switch to the client color
		ctx.strokeStyle=clientColor;
		ctx.beginPath();
		ctx.moveTo(c.width/2,y);
		ctx.lineTo(c.width-x-r,y);
		ctx.stroke();
		// do the thin line
		ctx.beginPath();
		ctx.moveTo(x+r,y);
		ctx.lineTo(c.width-x-r,y);
		ctx.lineWidth=thinLineWidth;
		ctx.strokeStyle=thinLineColor;
		ctx.stroke();
		
		//the box with the percentage
		ctx.beginPath();
		ctx.font = "2em Arial";
		var txt=Session.get("score")+"%";
		var width=ctx.measureText(txt).width;
		var pctBoxHeight=c.height/4;
		var x1=(c.width/2)-(width/2);
		var y1=y-pctBoxHeight/2;
		var pad=width*.08;
		ctx.strokeStyle="black";
		ctx.lineWidth=1;
		ctx.fillStyle="#000000";
		ctx.fillRect(x1-pad,y1,width+(pad*2),pctBoxHeight);
		ctx.stroke();
		ctx.beginPath();
		ctx.fillStyle="#F7C611";
		ctx.fillText(txt,x1,y1+pctBoxHeight*.75);
		ctx.stroke();
		
		//the descriptive text
		ctx.beginPath();
		ctx.font = "1em Arial";
		txt=", your Twitter personality is";
		var width1=ctx.measureText(bpProfile.name).width;
		var width2=ctx.measureText(txt).width;
		ctx.fillStyle=bpColor;
		ctx.fillText(bpProfile.name,c.width/2-(width1+width2)/2,c.height/5);
		ctx.fillStyle="black";
		ctx.fillText(txt,(c.width/2-(width1+width2)/2)+width1,c.height/5);
		ctx.stroke();
		
		//the "similar to" part
		ctx.beginPath();
		txt="similar to";
		width=ctx.measureText(txt).width;
		var txtHeight=ctx.measureText("M").width; //hokey hack, there's no .height property
		ctx.fillStyle="black";
		ctx.fillText(txt,c.width/2-width/2,y+pctBoxHeight/2+txtHeight+pad);
		ctx.stroke();

		//the client's name
		ctx.beginPath();
		txt=clientProfile.name;
		width=ctx.measureText(txt).width;
		ctx.fillStyle=clientColor;
		ctx.fillText(txt,c.width/2-width/2,y+pctBoxHeight/2+txtHeight*2+pad*2);
		ctx.stroke();
		
		//the BP's twitter ID
		ctx.beginPath();
		txt="@"+bpProfile.twitterId;
		width=ctx.measureText(txt).width;
		ctx.fillStyle=bpColor;
		ctx.fillText(txt,x-width/2,y+r+fatLineWidth+txtHeight);
		ctx.stroke();
		
		//the client's twitter ID
		ctx.beginPath();
		txt="@"+clientProfile.twitterId;
		width=ctx.measureText(txt).width;
		ctx.fillStyle=clientColor;
		ctx.fillText(txt,c.width-x-width/2,y+r+fatLineWidth+txtHeight);
		ctx.stroke();
		}
	
	function bumpPage(event, template) 
		{
		event.preventDefault(); // We'll handle it
		event.stopPropagation();
		if (event.target.name=="prev")
			decreasePageNumber();//slide in previous page
		else if (event.target.name=="next")
			increasePageNumber();//slide in next page
		else if (event.target.name=="fetch")
			increasePageNumber();//slide in next page
		return false;
		}
	
	function openLookup(event) 
		{
		console.log(event);
		event.preventDefault(); // We'll handle it
		event.stopPropagation();
		// Look up the client's twitter handle
		document.getElementById("overlay").style.visibility ="visible";
		document.getElementById("twitter-handle-lookup").className += "slideExpandUp";
		return false;
		}
	
	function closeLookup()
		{
		document.getElementById("overlay").style.visibility ="hidden";
		document.getElementById("twitter-handle-lookup").className =
			   document.getElementById("twitter-handle-lookup").className.replace
			      ( /(?:^|\s)slideExpandUp(?!\S)/g , '' )
		}
	
	function comparePageNums(pageNum) 
		{
		return Session.get('pageNumber')==pageNum;
		}
	
	function getTwitterUser()
		{
		var profile=Session.get("clientProfile");
		var twitterUser=document.getElementById("clientTwitter");
		if (twitterUser!=null)
			twitterUser=twitterUser.value;
		if (twitterUser==null || twitterUser.length==0)
			{
			profile= "Please enter the client's Twitter handle.";			
			}
		else if (profile==null)
			{
			console.log("Fetching Twitter profile for "+twitterUser);
			Meteor.call('getTwitterProfile', twitterUser, buildTwitterProfile);
			profile= '<img src="images/watson.gif">';
			}
		return profile;
		}
	
	
	function buildTwitterProfile(error, result)
		{
		var profile=null;
		if (error)
			{
			profile="An error has occurred: "+error;
			}
		else
			{
			var iframe = document.createElement('iframe');
			var html = result.content;
			document.getElementById("page2").appendChild(iframe);
			iframe.contentWindow.document.open();
			iframe.contentWindow.document.write(html);
			iframe.contentWindow.document.close();
			
			
			profile=""; //fake it
			}
//		Session.set("clientProfile",profile);
		}
	
	function increasePageNumber()
		{
		var page=Session.get('pageNumber');
		var whichPage=document.getElementById("page"+page);
    	whichPage.style.zIndex ="1"; //old page
    	whichPage.style.visibility ="hidden"; //hide it
    	whichPage.className =	//remove old sliders
    		whichPage.className.replace
 		      ( /(?:^|\s)slideRight(?!\S)/g , '' )
    	whichPage.className =	//both directions
    		whichPage.className.replace
 		      ( /(?:^|\s)slideLeft(?!\S)/g , '' )
		Session.set('pageNumber',++page);
    	whichPage=document.getElementById("page"+page);
    	if (whichPage==null)
    		{
    		Session.set('pageNumber',--page);
    		}
    	else
    		{
	    	whichPage.style.visibility ="visible"; //show it
	    	whichPage.style.zIndex ="10"; //new page
	    	whichPage.className += " slideLeft"; //slide it
    		}
		}
	
	function decreasePageNumber()
		{
		var page=Session.get('pageNumber');
		if (page==1) return;
		var whichPage=document.getElementById("page"+page);
		whichPage.style.zIndex ="1"; //old page
		whichPage.style.visibility ="hidden"; //hide it
		whichPage.className =	//remove old sliders
			whichPage.className.replace
  		      ( /(?:^|\s)slideLeft(?!\S)/g , '' )
    	whichPage.className =	//both directions
    		whichPage.className.replace
 		      ( /(?:^|\s)slideRight(?!\S)/g , '' )
		Session.set('pageNumber',--page);
		whichPage=document.getElementById("page"+page);
		whichPage.style.visibility ="visible"; //show it
		whichPage.style.zIndex ="10"; //new page
		whichPage.className += " slideRight"; //slide it
		}

	Template.page.helpers({
		  templateGestures: {
		    'swiperight div': function (event, templateInstance) {
		    	decreasePageNumber();
		    	},
		    'swipeleft div': function (event, templateInstance) {
		    	increasePageNumber();
		      /* `event` is the Hammer.js event object */
		      /* `templateInstance` is the `Blaze.TemplateInstance` */
		      /* `this` is the data context of the element in your template, so in this case `someField` from `someArray` in the template */
		    }
		  },
		
		pageIs: comparePageNums,
		clientProfile: getTwitterUser,
		personality: buildGraph,
		clientName: getClientName
		});

//  Template.client.onRendered(function() 
//		{
//	  	//this should make the template refresh when the client twitter name is rendered
//	    this.autorun(getTwitterUser);  
//	    }
//  );
  
  Template.page.onRendered(resizeCanvas);
  
  Template.client.events({
	    'click #lookitup': openLookup,
	    'click #close': closeLookup,
	    'blur #clientTwitter': getTwitterUser
	  });

  Template.page.events({
	    'click #fetch': bumpPage
  });
  
  Template.nav.events({
	'click a': bumpPage  
  });
}
if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
