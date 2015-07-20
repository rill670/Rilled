// ==UserScript==
// @name        Rilled
// @namespace   Rilled
// @description Grabs latest versions of the bot scripts automatically maybe.
// @include     http://agar.io/
// @version     0.1
// @grant       none
// @author      
// ==/UserScript==

var rilledLoaderVersion = 0.1;

var sha = "efde0488cc2cc176db48dd23b28a20b90314352b";
function getLatestCommit() {
    window.jQuery.ajax({
            url: "https://api.github.com/repos/rill670/Rilled/git/refs/heads/master",
            cache: false,
            dataType: "jsonp"
        }).done(function(data) {
            console.dir(data["data"])
            console.log("hmm: " + data["data"]["object"]["sha"]);
            sha = data["data"]["object"]["sha"];
            ;

            window.jQuery.get('https://raw.githubusercontent.com/rill670/Rilled/master/rilledlauncher.user.js?' + Math.floor((Math.random() * 1000000) + 1), function(data) {
                var latestVersion = data.replace(/(\r\n|\n|\r)/gm, "");
                latestVersion = latestVersion.substring(latestVersion.indexOf("// @version") + 11, latestVersion.indexOf("// @grant"));

                latestVersion = parseFloat(latestVersion + 0.0000);
                var script1 = "https://cdn.rawgit.com/rill670/Rilled/" + sha + "/rilledlauncher.user.js";
                console.log("Script: " + script1);
                window.jQuery("body").append('<script type="text/javascript" src="' + script1 + '"></script>');
                
            });
            window.jQuery.get('https://raw.githubusercontent.com/rill670/Rilled/master/rilledbot.user.js?' + Math.floor((Math.random() * 1000000) + 1), function(data) {
                var latestVersion = data.replace(/(\r\n|\n|\r)/gm, "");
                latestVersion = latestVersion.substring(latestVersion.indexOf("// @version") + 11, latestVersion.indexOf("// @grant"));

                latestVersion = parseFloat(latestVersion + 0.0000);
                var script2 = "https://cdn.rawgit.com/rill670/Rilled/" + sha + "/rilledbot.user.js";
                console.log("Script: " + script2);
                window.jQuery("body").append('<script type="text/javascript" src="' + script2 + '"></script>');
            });

            function update(prefix, name, url) {
                window.jQuery(document.body).prepend("<div id='" + prefix + "Dialog' style='position: absolute; left: 0px; right: 0px; top: 0px; bottom: 0px; z-index: 100; display: none;'>");
                window.jQuery('#' + prefix + 'Dialog').append("<div id='" + prefix + "Message' style='width: 350px; background-color: #FFFFFF; margin: 100px auto; border-radius: 15px; padding: 5px 15px 5px 15px;'>");
                window.jQuery('#' + prefix + 'Message').append("<h2>UPDATE TIME!!!</h2>");
                window.jQuery('#' + prefix + 'Message').append("<p>Grab the update for: <a id='" + prefix + "Link' href='" + url + "' target=\"_blank\">" + name + "</a></p>");
                window.jQuery('#' + prefix + 'Link').on('click', function() {
                    window.jQuery("#" + prefix + "Dialog").hide();
                    window.jQuery("#" + prefix + "Dialog").remove();
                });
                window.jQuery("#" + prefix + "Dialog").show();
            }

            window.jQuery.get('https://raw.githubusercontent.com/rill670/Rilled/master/rilledloader.user.js?' + Math.floor((Math.random() * 1000000) + 1), function(data) {
                var latestVersion = data.replace(/(\r\n|\n|\r)/gm, "");
                latestVersion = latestVersion.substring(latestVersion.indexOf("// @version") + 11, latestVersion.indexOf("// @grant"));

                latestVersion = parseFloat(latestVersion + 0.0000);
                var myVersion = parseFloat(rilledLoaderVersion + 0.0000);

                if (latestVersion > myVersion) {
                    update("rilledLoader", "rilledloader.user.js", "https://github.com/rill670/Rilled/blob/master/rilledloader.user.js/");
                }
                console.log('Current rilledloader.user.js Version: ' + myVersion + " on Github: " + latestVersion);
            });
        }).fail(function() {});
}

getLatestCommit();
