if (Meteor.isClient) {
	Session.setDefault('pageNumber',1);
	
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
		Session.set('pageNumber',++page);
		}
	
	function decreasePageNumber()
		{
		var page=Session.get('pageNumber');
		Session.set('pageNumber',--page);
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
	    'click button': function (event) 
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
