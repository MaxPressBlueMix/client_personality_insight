
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


if (Meteor.isClient) {
	Session.set('pageNumber',1);
	Session.set("clientProfile",null);
	window.addEventListener('resize', resizeCanvas, false);
	
	function buildGraph()
		{
//		var profile=Session.get("clientProfile");
//		console.log("client profile is ");
//		console.log(profile);
		if (comparePageNums(2))
			{
			// draw the picture circles
			var c = document.getElementById("p-photos");
			var ctx = c.getContext("2d");
			
			// BP picture circle
			var x=c.width/6.7;
			var y=c.height*.44;
			var r=(c.height*.66)/2;
			//the thick oval
			drawOval(ctx,x,y,r,"#02d896",c.height*0.1);
			//the thin white line in the oval
			drawOval(ctx,x,y,r,"white",1);
			
			// Client picture circle
			x=c.width-x;
			//the thick oval
			drawOval(ctx,x,y,r,"#A364FB",c.height*0.1);
			//the thin white line in the oval
			drawOval(ctx,x,y,r,"white",1);
			

			}
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
		Session.set("clientProfile",profile);
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
		personality: buildGraph
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
