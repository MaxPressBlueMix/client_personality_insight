
if (Meteor.isClient) {

	window.onerror = function(error) // for debugging on Safari
		{
		alert(error);
		};
		
	var isSafari = navigator.vendor && navigator.vendor.indexOf('Apple') > -1;
	var bpImage=new Image(200,200);
	var clImage=new Image(200,200);
	var dotDecImage=new Image(40,40);
	var pageIsRendered=false;
	var fetched=false;
	var bpColor="#09afeb";
	var clientColor="#8dc53e";
	var photoBackgroundColor="#F2FAFC";
	var oldWindowWidth=0;
	var oldWindowHeight=0;

	dw_Tooltip.defaultProps = {
		    hoverable: true, // tooltip lingers so user can hover to click links
		    supportTouch: true //, // enables support for touch devices 
//		    klass: 'tooltip', // class to be used for tooltips
//		    wrapFn: dw_Tooltip.wrapToWidth // formatting function for tooltip content
		}
	
	dw_Tooltip.content_vars = {};
	 
	
	Session.set("clientProfile",null);
	Session.set("bpProfile",null);
	
	Session.set("score",67);

	Session.set('pageNumber',1);
	
	function getClientName()
		{
		var name="";
		var profile=Session.get("clientProfile");
		if (profile!=null)
			name=profile.name;
		return name;
		}
	
	function resizeCanvas() 
		{
		oldWindowWidth=window.innerWidth;
		oldWindowHeight=window.innerHeight;
		var c = document.getElementById("p-photos");
		c.width = window.innerWidth;//*.986;
		c.height = window.innerHeight/4;  //25%
		buildGraph();
		drawClientPicture();
		drawBpPicture();
		pageIsRendered=true;
		}

	window.addEventListener('resize', resizeCanvas, false);
	window.addEventListener('load',function(){pageIsRendered=true;});
	
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
		if (Session.get("clientProfile"))
			{
			var c = document.getElementById("p-photos");
			var ctx = c.getContext("2d");
		
			var fatLineWidth=c.height*0.1;	
			var x=c.width/6.7;
			var y=c.height*.44;
			var r=(c.height*.66)/2;
			var w=r*2-fatLineWidth;
			var h=w;
			ctx.drawImage(clImage,x-w/2,y-h/2,w,h);
			drawSummarySection(Session.get("bpProfile"),Session.get("clientProfile"));
			}
		}
	
	function badClientPicture()
		{
		
		}
	
	function drawBpPicture()
		{
		if (Session.get("bpProfile"))
			{
			var c = document.getElementById("p-photos");
			var ctx = c.getContext("2d");
		
			var fatLineWidth=c.height*0.1;	
			var x=c.width-c.width/6.7;
			var y=c.height*.44;
			var r=(c.height*.66)/2;
			var w=r*2-fatLineWidth;
			var h=w;
			ctx.drawImage(bpImage,x-w/2,y-h/2,w,h);
			drawSummarySection(Session.get("bpProfile"),Session.get("clientProfile"));
			}
		}
	
	function badBpPicture()
		{
		
		}
	
	function drawBpDots()
		{
		var analysis=Session.get("bpAnalysis");
		if (analysis!=null)
			{
			console.log("****************");
			console.log(analysis);
			console.log("****************");
			drawDot("agreeableness",analysis.agreeableness.score,bpColor);
			drawDot("conscientiousness",analysis.conscientiousness.score,bpColor);
			drawDot("extraversion",analysis.extraversion.score,bpColor);
			drawDot("neuroticism",analysis.neuroticism.score,bpColor);
			drawDot("openness",analysis.openness.score,bpColor);
			}
		}
	
	function drawClDots()
		{
		var analysis=Session.get("clientAnalysis");
		if (analysis!=null)
			{
			drawDot("agreeableness",analysis.agreeableness.score,clientColor);
			drawDot("conscientiousness",analysis.conscientiousness.score,clientColor);
			drawDot("extraversion",analysis.extraversion.score,clientColor);
			drawDot("neuroticism",analysis.neuroticism.score,clientColor);
			drawDot("openness",analysis.openness.score,clientColor);
			}
		}
	
	function drawDot(canvas,value,color)
		{
		var c = document.getElementById(canvas);
		var ctx = c.getContext("2d");
		var size=c.height*.7;
		var y=(c.height-size)/2;
		y=c.height/2;
		var x=c.width*value;
		if (x<c.width/20) //bumping the left edge
			x=c.width/20;
		else if (x>(c.width-(c.width/20))) //bumping the right edge
			x=c.width-(c.width/20);
		ctx.strokeStyle=color;
		ctx.fillStyle=color;
		ctx.beginPath();
		ctx.arc(x,y,size/2,0,2*Math.PI);
		ctx.fill();
		ctx.stroke();
		}
	
	function drawDecorations()
		{
		var exp="";
		var analysis=Session.get("clientAnalysis");
		if (analysis!=null)
			{
			drawDecoration("agreeableness",analysis.agreeableness.facets,analysis.agreeableness.score);
			drawDecoration("conscientiousness",analysis.conscientiousness.facets,analysis.conscientiousness.score);
			drawDecoration("extraversion",analysis.extraversion.facets,analysis.extraversion.score);
			drawDecoration("neuroticism",analysis.neuroticism.facets,analysis.neuroticism.score);
			drawDecoration("openness",analysis.openness.facets,analysis.openness.score);
			}
		}
	
	function drawDecoration(canvasName,levels,position)
		{
		if (levels)
			{
			var c = document.getElementById(canvasName);
			var ctx = c.getContext("2d");
			var size=c.height*.7;
			var xLoc=c.width*position;
			if (xLoc<c.width/20) //bumping the left edge
				xLoc=c.width/20;
			else if (xLoc>(c.width-(c.width/20))) //bumping the right edge
				xLoc=c.width-(c.width/20);
			ctx.drawImage(dotDecImage,xLoc-size/5,0,size,size);
			
			c.className+=" showTip "+canvasName;
			var text=buildPersonalityText(levels); //get the tooltip text
			dw_Tooltip.content_vars[canvasName]={'location':xLoc,'width':size,'content':text};
			}
		}
	
	function buildPersonalityText(facetList)
		{
		var text="";
		for (var facet in facetList)
			{
			if (facetList[facet]>0)//has a score?
				{
				var score=facetList[facet]<0.5?"low":"high";
				if (traits[facet])
					text+=traits[facet][score].description+" <b>"+traits[facet][score].guidance+"</b> ";
				}
			}
		return text;
		}
	
	function getAbsoluteCoord(id)
		{
		var e = document.getElementById(id);
		var offset = {x:0,y:0};
		while (e)
			{
		    offset.x += e.offsetLeft;
		    offset.y += e.offsetTop;
		    e = e.offsetParent;
			}
	
		if (document.documentElement && (document.documentElement.scrollTop || document.documentElement.scrollLeft))
			{
		    offset.x -= document.documentElement.scrollLeft;
		    offset.y -= document.documentElement.scrollTop;
			}
		else if (document.body && (document.body.scrollTop || document.body.scrollLeft))
			{
		    offset.x -= document.body.scrollLeft;
		    offset.y -= document.body.scrollTop;
			}
		else if (window.pageXOffset || window.pageYOffset)
			{
		    offset.x -= window.pageXOffset;
		    offset.y -= window.pageYOffset;
			}
		return{"X":offset.x, "Y":offset.y};
		}
	
	function badDecoration()
		{
		console.log("Unable to load dot decoration.");
		}
	
	function clearCanvas(canvasName)
		{
		var c = document.getElementById(canvasName);
		var ctx = c.getContext("2d");
		ctx.clearRect(0, 0, c.width, c.height);
		}

	function somebodyTyped()
		{
		fetched=false;
		Session.set("clientAnalysis",null);
		Session.set("bpAnalysis",null);
		adjustSubmitButton();
		}

	/*
	 * Enable the submit button only if entries in both twitter handle fields
	 */
	function adjustSubmitButton()
		{
		if (getClientTwitterId().length>0 && getPartnerTwitterId().length>0)
			{
			document.getElementById("fetch").disabled=false; 
			document.getElementById("next").setAttribute("disabled","false");
			}
		else
			{
			document.getElementById("fetch").disabled=true;
			document.getElementById("next").setAttribute("disabled","true");
			}
		}

	
	function buildGraph()
		{
		if (comparePageNums(2))
			{
			var clientProfile=Session.get("clientProfile");
			var bpProfile=Session.get("bpProfile");
			if (clientProfile!=null && bpProfile!=null)
				{
//				clearCanvas("p-photos"); //get ready
				//get the images loading
				console.log("Loading client and BP images...");
				bpImage.src=bpProfile.profile_image_url;
				console.log("BP image is at ",bpImage.src);
				bpImage.onload=drawBpPicture;
				bpImage.onerror=badBpPicture;
				clImage.src=clientProfile.profile_image_url;
				console.log("Client image is at ",clImage.src);
				clImage.onload=drawClientPicture;
				clImage.onerror=badClientPicture;
				dotDecImage.onload=drawDecorations;
				dotDecImage.onerror=badDecoration;
				dotDecImage.src="images/circledecoration.gif";
				var bpProfile=Session.get("bpProfile");
				drawSliders(bpProfile,clientProfile);
				drawBpDots();
				drawClDots();
				if (isSafari) // WTF Safari?
					{
					drawDecorations();  
					drawSimilarityBox();
					}
				}
			else if (!fetched)
				fetch();
			}
		}
	
	/*
	 * Draws the sliders with the dots
	 */
	function drawSliders(bpProfile,clientProfile)
		{
		drawSlider("agreeableness");
		drawSlider("conscientiousness");
		drawSlider("extraversion");
		drawSlider("neuroticism");
		drawSlider("openness");
		}
	
	/*
	 * Draws a slider with the dots
	 */
	function drawSlider(canvas,partner,client)
		{
		clearCanvas(canvas);
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
//		clearCanvas("p-photos");
		//set up some variables to draw the ovals
		var c = document.getElementById("p-photos");
		var ctx = c.getContext("2d");

		var thinLineColor="white";
		var fatLineWidth=c.height*0.1;
		var thinLineWidth=1;

		// client picture circle
		var x=c.width/6.7;
		var y=c.height*.44;
		var r=(c.height*.66)/2;
		//get rid of the photo corners
		drawOval(ctx,x,y,r+fatLineWidth,photoBackgroundColor,fatLineWidth);
		//the thick oval
		drawOval(ctx,x,y,r,clientColor,fatLineWidth);
		//the thin white line in the oval
		drawOval(ctx,x,y,r,thinLineColor,thinLineWidth);
		
		// BP picture circle
		//get rid of the photo corners
		drawOval(ctx,c.width-x,y,r+fatLineWidth,photoBackgroundColor,fatLineWidth);
		//the thick oval
		drawOval(ctx,c.width-x,y,r,bpColor,fatLineWidth);
		//the thin white line in the oval
		drawOval(ctx,c.width-x,y,r,thinLineColor,1);
		
		//draw the line between the circles
		// do the wide client line
		ctx.beginPath();
		ctx.moveTo(x+r,y);
		ctx.lineTo(c.width/2,y); //stop in the center
		ctx.strokeStyle=clientColor;
		ctx.lineWidth=fatLineWidth;
		ctx.stroke();

		//switch to the bp color
		ctx.strokeStyle=bpColor;
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
		
		drawSimilarityBox();//the box with the percentage
		
		//the descriptive text
		ctx.beginPath();
		ctx.font = "2.5vw Arial";
		txt="Similarity";
		var width1=0;
		var width2=ctx.measureText(txt).width;
		ctx.fillStyle="black";
		ctx.fillText(txt,(c.width/2-(width1+width2)/2)+width1,c.height/5);
		ctx.stroke();
		var txtHeight=ctx.measureText("M").width; //hokey hack, there's no .height property
		
		//the client's twitter ID
		ctx.beginPath();
		txt="@"+getClientTwitterId();
		width=ctx.measureText(txt).width;
		ctx.fillStyle=clientColor;
		ctx.fillText(txt,x-width/2,y+r+fatLineWidth+txtHeight);
		ctx.stroke();
		
		//the BP's twitter ID
		ctx.beginPath();
		txt="@"+getPartnerTwitterId();
		width=ctx.measureText(txt).width;
		ctx.fillStyle=bpColor;
		ctx.fillText(txt,c.width-x-width/2,y+r+fatLineWidth+txtHeight);
		ctx.stroke();
		}

	function drawSimilarityBox() //the box with the percentage
		{
		var client=Session.get("clientAnalysis");
		var partner=Session.get("bpAnalysis");
		
		if (client && partner)
			{
			var c = document.getElementById("p-photos");
			var ctx = c.getContext("2d");				
			ctx.beginPath();
			ctx.font = "5.0vh Arial";
			var txt=calculateSimilarity()+"%";
			var width=ctx.measureText(txt).width;
			var pctBoxHeight=c.height/4;
			var x1=(c.width/2)-(width/2);
			var y=c.height*.44;
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
			}
		else
			console.log("Analysis not yet complete");
		}
	
	function calculateSimilarity()
		{
		var client=Session.get("clientAnalysis");
		var partner=Session.get("bpAnalysis");
		
		if (client && partner)
			{
			var c=client.openness.score;
			var p=partner.openness.score;
			var diff=Math.min(c,p)/Math.max(c,p);

			c=client.conscientiousness.score;
			p=partner.conscientiousness.score;
			diff+=Math.min(c,p)/Math.max(c,p);
	
			c=client.extraversion.score;
			p=partner.extraversion.score;
			diff+=Math.min(c,p)/Math.max(c,p);
	
			c=client.agreeableness.score;
			p=partner.agreeableness.score;
			diff+=Math.min(c,p)/Math.max(c,p);
	
			c=client.neuroticism.score;
			p=partner.neuroticism.score;
			diff+=Math.min(c,p)/Math.max(c,p);
			
			diff=Math.round((diff/5)*100);
			return diff;
			}
		}
	
	function fetchAll(event)
		{
		if (event)
			{
			event.preventDefault(); // We'll handle it
			event.stopPropagation();
			}
		fetch();
		increasePageNumber();//slide in next page		
		}
	
	function fetch() 
		{
		fetched=true;
		fetchClientTwitterProfile();
		fetchBPTwitterProfile();
		fetchClientTweets();
		fetchBPTweets();
		}
	
	function bumpPage(event, template) 
		{
		event.preventDefault(); // We'll handle it
		event.stopPropagation();
		var prevDisabled=document.getElementById("prev").getAttribute("disabled")=="true";
		var nextDisabled=document.getElementById("next").getAttribute("disabled")=="true";
		console.log("prev/next disabled: ",prevDisabled+"/"+nextDisabled);
		if (event.target.name=="prev" && !prevDisabled)
			decreasePageNumber();//slide in previous page
		else if (event.target.name=="next" && !nextDisabled)
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

	function getPartnerTwitterId()
		{
		Session.get("bpProfile"); //this fixes a reactivity problem on page 2
		var t="";
		if (pageIsRendered)
			{
			t=document.getElementById("bpTwitter").value;
			if (t.charAt(0)=='@')
				{
				t=t.substring(1); //don't need the @
				document.getElementById("bpTwitter").value=t;
				if (t.length==0)
					document.getElementById("bpTwitter").placeholder="Don't enter the '@'";
				}
			}
		return t;
		}

	function getClientTwitterId()
		{
		Session.get("clientProfile"); //this fixes a reactivity problem on page 2
		var t="";
		if (pageIsRendered)
			{
			t=document.getElementById("clientTwitter").value;
			if (t.charAt(0)=='@')
				{
				t=t.substring(1); //don't need the @
				document.getElementById("clientTwitter").value=t;
				if (t.length==0)
					document.getElementById("clientTwitter").placeholder="Don't enter the '@'";
				}
			}
		return t;
		}
	
	function getClientFirstName()
		{
		return getClientName().split(" ")[0];
		}

	function fetchBPTwitterProfile()
		{
		var profile=Session.get("bpProfile");
		var twitterUser=getPartnerTwitterId();
		fetchTwitterProfile(profile,twitterUser);
		return false;
		}
	
	
	function fetchClientTwitterProfile()
		{
		var profile=Session.get("clientProfile");
		var twitterUser=getClientTwitterId();
		fetchTwitterProfile(profile,twitterUser);
		return false;
		}
	
	function fetchTwitterProfile(profile,twitterUser)
		{
		//see if twitter user has been changed
		if (profile!=null && twitterUser!=profile.screen_name)
			profile=null;
		
		if (twitterUser==null || twitterUser.length==0)
			{
			profile= "Please enter the BP and client Twitter handles.";			
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
		console.log("Building twitter profile...");
		var profile=null;
		if (error)
			{
			profile="An error has occurred: "+error;
			console.log("Error! ",error);
			}
		else
			{
			console.log(result);
			if (result.screen_name==getClientTwitterId())
				{
				Session.set("clientProfile",result);
				buildGraph();
				}
			else if (result.screen_name==getPartnerTwitterId())
				{
				Session.set("bpProfile",result);
				buildGraph();
				}
			else
				alert("Can't find the Twitter profile!");
			}
		}
	
	function fetchClientTweets()
		{
		var twitterUser=getClientTwitterId();
		fetchTweets(twitterUser);
		}
	
	function fetchBPTweets() 
		{
		var twitterUser=getPartnerTwitterId();
		fetchTweets(twitterUser);
		}
	
	function fetchTweets(twitterUser)
		{
		var tweets=null;
		if (twitterUser==null || twitterUser.length==0)
			{
			tweets= "Twitter handle ("+twitterUser+") is invalid.";
			console.log(tweets);
			}
		else 
			{
			console.log("Fetching tweets for "+twitterUser);
			Meteor.call('getTweets', twitterUser, buildTweets);
			}
		return tweets;
		}
	
	/*
	 * Callback function for server "getTweets"
	 */
	function buildTweets(error, result)
		{
		var profile=null;
		if (error)
			{
			console.log("Error fetching tweets! ",error);
			}
		else
			{
			console.log(result);
			if (result[getClientTwitterId()]!=null)
				{
				console.log("Storing tweets for client",result);				
				Session.set("clientAnalysis",result[getClientTwitterId()]);
				}
			else
				{
				console.log("Storing tweets for partner",result);				
				Session.set("bpAnalysis",result[getPartnerTwitterId()]);
				}
			}
		}
	
	function increasePageNumber()
		{
		var page=Session.get('pageNumber');
		if (page==1 && !fetched)
			fetch();
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
    	document.getElementById("prev").setAttribute("disabled","false");
    	window.scrollTo(0,0);
    	
    	//re-render the graph page
//    	if (page==2)
//    		$('#page2').html(Meteor.render(document.getElementById("p-compat")));
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
		
		if (page==1)
			document.getElementById("prev").setAttribute("disabled","true");
		else
			document.getElementById("prev").setAttribute("disabled","false");
		
		window.scrollTo(0,0);
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
		personality: buildGraph,
		clientName: getClientName,
		partnerTwitterId:getPartnerTwitterId,
		clientTwitterId:getClientTwitterId,
		clientFirstName:getClientFirstName
		});

  
  Template.page.onRendered(resizeCanvas);
  
  Template.client.events({
	    'click #lookitup': openLookup,
	    'click #close': closeLookup,
	    'keyup #clientTwitter, keyup #bpTwitter': somebodyTyped
	  });

  Template.page.events({
	    'click #fetch': fetchAll,
	    'submit form': function(event){
	        // Stop form submission
	        event.preventDefault();
	    }
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
