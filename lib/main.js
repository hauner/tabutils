const widgets = require("widget");
const {Cc,Ci} = require("chrome");
const tabs = require("tabs");

var data = require("self").data;
var count = require("widget").Widget({
  id: "tabutils-tab-count",
  label: "Tab Counter",
  contentURL: data.url("tabutils-display.html"),
  contentScriptFile: data.url("tabutils-script.js")
});

// init counter
updateCounter (0);

count.port.on("count", function() {
  //console.log("pressed count");
});

tabs.on('activate', function (tab) {
	updateCounter (0);
});

tabs.on('open', function onOpen (tab) {
	updateCounter (1);
});

/*
tabs.on('close', function onClose (tab) {
	console.log ("close");
	updateCounter (-1);
});
*/

function updateCounter (correction) {
	var data = tabData ();
	count.port.emit("update", data.count + correction);
	count.tooltip = data.title;
}

function tabData () {
	if (getTabView () === null) {
	    return forWindow ();
	}
	return forTabGroup ();
}


function getTabView () {
	// CC = Components.classes
  	// Ci = Components.interfaces
  	let mediator = Cc["@mozilla.org/appshell/window-mediator;1"].getService (Ci.nsIWindowMediator);
  	let mr_window = mediator.getMostRecentWindow ('navigator:browser');

 	 // chrome://browser/content/tabview.html
  	let tabView = mr_window.document.getElementById ('tab-view');
  	return tabView;
};

function forWindow () {
	var windows = require ("windows").browserWindows;
	return {
		count: windows.activeWindow.tabs.length,
		title: ""
	}
}

function forTabGroup () {
	//var tabGroupItems = tabView.contentWindow.GroupItems.groupItems;
	//console.log ("tab groups:"+ tabGroupItems.length);
	
	var activeGroupItem = getTabView ().contentWindow.GroupItems.getActiveGroupItem ();
	return {
		count: activeGroupItem.getChildren ().length,
		title: activeGroupItem.getTitle ()
	}
}

/* scratch
  var tabs = require ("tabs");

  for each (var tab in tabs) {
    console.log(tab.title);
    console.log(tab.index);
    console.log(tab.group);
	console.log(tab.url);
  }
*/
