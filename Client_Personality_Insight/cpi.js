if (Meteor.isClient) {
	Session.set('pageNumber',1);
	
//	function SlideIn(el){
//	    var elem = document.getElementById(el);
//	    elem.style.transition = "left 1.5s linear 0s";
//	    elem.style.left = "10px";
//	}
//	function SlideOut(el){
//	    var elem = document.getElementById(el);
//	    elem.style.transition = "left 1.5s linear 0s";
//	    elem.style.left = "-200px";
//	}

	
	function increasePageNumber()
		{
		var page=Session.get('pageNumber');
    	document.getElementById("page"+page).style.zIndex ="1"; //old page
    	document.getElementById("page"+page).style.visibility ="hidden"; //hide it
    	document.getElementById("page"+page).className =	//remove old slider
 		   document.getElementById("page"+page).className.replace
 		      ( /(?:^|\s)slideRight(?!\S)/g , '' )
		Session.set('pageNumber',++page);
    	document.getElementById("page"+page).style.visibility ="visible"; //show it
    	document.getElementById("page"+page).style.zIndex ="10"; //new page
    	document.getElementById("page"+page).className += " slideLeft"; //slide it
		}
	
	function decreasePageNumber()
		{
		var page=Session.get('pageNumber');
		if (page==1) return;
    	document.getElementById("page"+page).style.zIndex ="1"; //old page
    	document.getElementById("page"+page).style.visibility ="hidden"; //hide it
    	document.getElementById("page"+page).className =	//remove old slider
  		document.getElementById("page"+page).className.replace
  		      ( /(?:^|\s)slideLeft(?!\S)/g , '' )
		Session.set('pageNumber',--page);
    	document.getElementById("page"+page).style.visibility ="visible"; //show it
    	document.getElementById("page"+page).style.zIndex ="10"; //new page
    	document.getElementById("page"+page).className += " slideRight"; //slide it
		}

	Template.page.helpers({
		  templateGestures: {
		    'swiperight div': function (event, templateInstance) {
		    	console.log(event);
		    	decreasePageNumber();
		    	},
		    'swipeleft div': function (event, templateInstance) {
		    	console.log(event);
		    	increasePageNumber();
		      /* `event` is the Hammer.js event object */
		      /* `templateInstance` is the `Blaze.TemplateInstance` */
		      /* `this` is the data context of the element in your template, so in this case `someField` from `someArray` in the template */
		    }
		  },
		
	pageIs: function(pageNum) 
		{
		return Session.get('pageNumber')==pageNum;
		}
	});

  // counter starts at 0
  Session.setDefault('counter', 0);

  Template.client.events({
	    'click #lookitup': function (event) 
	    	{
	    	event.preventDefault(); // We'll handle it
	    	event.stopPropagation();
	    	// Look up the client's twitter handle
	    	document.getElementById("overlay").style.visibility ="visible";
	    	document.getElementById("twitter-handle-lookup").className += "slideExpandUp";
	    	return false;
	    	},
	    'click #close': function ()
	    	{
	    	document.getElementById("overlay").style.visibility ="hidden";
	    	document.getElementById("twitter-handle-lookup").className =
	    		   document.getElementById("twitter-handle-lookup").className.replace
	    		      ( /(?:^|\s)slideExpandUp(?!\S)/g , '' )
	    	}
	  });

  Template.nav.events({
	'click a': function(event, template) {
		
		if (event.target.name=="prev")
			decreasePageNumber();//slide in previous page
		else if (event.target.name=="next")
			increasePageNumber();//slide in next page
	}  
  });
}
if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
