// ==UserScript==
// @name        Rilled
// @namespace   Rilled
// @include     http://agar.io/*
// @version     0.1
// @grant       none
// @author      
// ==/UserScript==

var rilledBotVersion = 0.1;

Number.prototype.mod = function(n) {
    return ((this % n) + n) % n;
};

Array.prototype.peek = function() {
    return this[this.length - 1];
};

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

            $.get('https://raw.githubusercontent.com/rill670/Rilled/master/rilledbot.user.js?' + Math.floor((Math.random() * 1000000) + 1), function(data) {
                var latestVersion = data.replace(/(\r\n|\n|\r)/gm,"");
                latestVersion = latestVersion.substring(latestVersion.indexOf("// @version")+11,latestVersion.indexOf("// @grant"));

                latestVersion = parseFloat(latestVersion + 0.0000);
                var myVersion = parseFloat(rilledBotVersion + 0.0000); 
                
                if(latestVersion > myVersion)
                {
                    update("rilledBot", "rilledbot.user.js", "https://github.com/rill670/Rilled/blob/" + sha + "/rilledbot.user.js/");
                }
                console.log('Current bot.user.js Version: ' + myVersion + " on Github: " + latestVersion);
            });

        }).fail(function() {});
}
getLatestCommit();

console.log("Running Rilled!");
(function(f, g) {
    var splitDistance = 710;
    console.log("Rilled!");

    if (f.botList == null) {
        f.botList = [];
        g('#locationUnknown').append(g('<select id="bList" class="form-control" onchange="setBotIndex($(this).val());" />'));
        g('#locationUnknown').addClass('form-group');
    }

    for (var i = f.botList.length - 1; i >= 0; i--) {
        if (f.botList[i][0] == "Human") {
            f.botList.splice(i, 1);
        }
    }

    f.botList.push(["Rilled " + rilledBotVersion, findDestination]);

    var bList = g('#bList');
    g('<option />', {value: (f.botList.length - 1), text: "Rilled"}).appendTo(bList);

    //Given an angle value that was gotten from valueAndleBased(),
    //returns a new value that scales it appropriately.

    function computeDistance(x1, y1, x2, y2) {
        var xdis = x1 - x2; // <--- FAKE AmS OF COURSE!
        var ydis = y1 - y2;
        var distance = Math.sqrt(xdis * xdis + ydis * ydis);

        return distance;
    }

    function computerDistanceFromCircleEdge(x1, y1, x2, y2, s2) {
        var tempD = computeDistance(x2, y2, x1, y1);

        var offsetX = 0;
        var offsetY = 0;

        var ratioX = tempD / (x2 - x1);
        var ratioY = tempD / (y2 - y1);

        offsetX = x2 - (s2 / ratioX);
        offsetY = y2 - (s2 / ratioY);

        return computeDistance(x1, y1, offsetX, offsetY);
    }

    function compareSize(player1, player2, ratio) {
        if (player1.size * player1.size * ratio < player2.size * player2.size) {
            return true;
        }
        return false;
    }

    function canSplit(player1, player2) {
        return compareSize(player1, player2, 2.30) && !compareSize(player1, player2, 9);
    }

    function isItMe(player, cell2) {
        if (getMode() == ":teams") {
            var currentColor = player[0].color;

            var currentRed = parseInt(currentColor.substring(1,3), 16);
            var currentGreen = parseInt(currentColor.substring(3,5), 16);
            var currentBlue = parseInt(currentColor.substring(5,7), 16);

            var currentTeam = getTeam(currentRed, currentGreen, currentBlue);

            var cellColor = cell2.color;

            var cellRed = parseInt(cellColor.substring(1,3), 16);
            var cellGreen = parseInt(cellColor.substring(3,5), 16);
            var cellBlue = parseInt(cellColor.substring(5,7), 16);

            var cellTeam = getTeam(cellRed, cellGreen, cellBlue);

            if (currentTeam == cellTeam && !cell2.isVirus()) {
                return true;
            }

            //console.log("COLOR: " + color);

        } else {
            for (var i = 0; i < player.length; i++) {
                if (cell2.id == player[i].id) {
                    return true;
                }
            }
        }
        return false;
    }

    function getTeam(red, green, blue) {
        if (red > green && red > blue) {
            return 0;
        } else if (green > red && green > blue) {
            return 1;
        }
        return 2;
    }

    function isThreat(blob, cell) {
        if (!cell.isVirus() && compareSize(blob, cell, 1.30)) {
            return true;
        }
        return false;
    }

    function isVirus(blob, cell) {
        if (cell.isVirus() && compareSize(cell, blob, 1.30)) {
            return true;
        } else if (cell.isVirus() && cell.color.substring(3,5).toLowerCase() != "ff") {
            return true;
        }
        return false;
    }

    function separateListBasedOnFunction(listToUse, blob) {
        var foodElementList = [];
        var threatList = [];
        var virusList = [];
        var splitTargetList = [];

        var player = getPlayer();

        Object.keys(listToUse).forEach(function(element, index) {
            var isMe = isItMe(player, listToUse[element]);

            if (!isMe) {
                if (isFood(blob, listToUse[element])) {
                    //IT'S FOOD!
                    foodElementList.push(listToUse[element]);

                    if (isSplitTarget(blob, listToUse[element])) {
                        drawCircle(listToUse[element].x, listToUse[element].y, listToUse[element].size + 50, 7);
                        splitTargetList.push(listToUse[element])
                    }
                } else if (isThreat(blob, listToUse[element])) {
                    //IT'S DANGER!
                    threatList.push(listToUse[element]);
                } else if (isVirus(blob, listToUse[element])) {
                    //IT'S VIRUS!
                    virusList.push(listToUse[element]);
                }
            }
        });

        foodList = [];
        for (var i = 0; i < foodElementList.length; i++) {
            foodList.push([foodElementList[i].x, foodElementList[i].y, foodElementList[i].size]);
        }

        return [foodList, threatList, virusList, splitTargetList];
    }

    function slope(x1, y1, x2, y2) {
        var m = (y1 - y2) / (x1 - x2);

        return m;
    }

    function slopeFromAngle(degree) {
        if (degree == 270) {
            degree = 271;
        } else if (degree == 90) {
            degree = 91;
        }
        return Math.tan((degree - 180) / 180 * Math.PI);
    }

    //Given two points on a line, finds the slope of a perpendicular line crossing it.
    function inverseSlope(x1, y1, x2, y2) {
        var m = slope(x1, y1, x2, y2);
        return (-1) / m;
    }
	
    function followAngle(angle, useX, useY, distance) {
        var slope = slopeFromAngle(angle);
        var coords = pointsOnLine(slope, useX, useY, distance);

        var side = (angle - 90).mod(360);
        if (side < 180) {
            return coords[1];
        } else {
            return coords[0];
        }
    }
	
	function findDestination(followMouse) {
        var player = getPlayer();
        var interNodes = getMemoryCells();

        if ( /*!toggle*/ 1) {
            var useMouseX = (getMouseX() - getWidth() / 2 + getX() * getRatio()) / getRatio();
            var useMouseY = (getMouseY() - getHeight() / 2 + getY() * getRatio()) / getRatio();
            tempPoint = [useMouseX, useMouseY, 1];

            var tempMoveX = getPointX();
            var tempMoveY = getPointY();

            var destinationChoices = []; //destination, size, danger

            if (player.length > 0) {

                for (var k = 0; k < player.length; k++) {

                    //console.log("Working on blob: " + k);

                    drawCircle(player[k].x, player[k].y, player[k].size + splitDistance, 5);
                    //drawPoint(player[0].x, player[0].y - player[0].size, 3, "" + Math.floor(player[0].x) + ", " + Math.floor(player[0].y));

                    //var allDots = processEverything(interNodes);

                    var allIsAll = getAll(player[k]);

                    var allPossibleFood = allIsAll[0];
                    var allPossibleThreats = allIsAll[1];
                    var allPossibleViruses = allIsAll[2];

                    var badAngles = [];
                    var obstacleList = [];

                    var isSafeSpot = true;
                    var isMouseSafe = true;

                    var clusterAllFood = clusterFood(allPossibleFood, player[k].size);

                    //console.log("Looking for enemies!");

                    for (var i = 0; i < allPossibleThreats.length; i++) {

                        var enemyDistance = computeDistance(allPossibleThreats[i].x, allPossibleThreats[i].y, player[k].x, player[k].y);

                        var splitDangerDistance = allPossibleThreats[i].size + splitDistance + 150;

                        var normalDangerDistance = allPossibleThreats[i].size + 150;

                        var shiftDistance = player[k].size;

                        //console.log("Found distance.");

                        var enemyCanSplit = canSplit(player[k], allPossibleThreats[i]);
                        
                        for (var j = clusterAllFood.length - 1; j >= 0 ; j--) {
                            var secureDistance = (enemyCanSplit ? splitDangerDistance : normalDangerDistance);
                            if (computeDistance(allPossibleThreats[i].x, allPossibleThreats[i].y, clusterAllFood[j][0], clusterAllFood[j][1]) < secureDistance)
                                clusterAllFood.splice(j, 1);
                        }

                        //console.log("Removed some food.");

                        if (enemyCanSplit) {
                            drawCircle(allPossibleThreats[i].x, allPossibleThreats[i].y, splitDangerDistance, 0);
                            drawCircle(allPossibleThreats[i].x, allPossibleThreats[i].y, splitDangerDistance + shiftDistance, 6);
                        } else {
                            drawCircle(allPossibleThreats[i].x, allPossibleThreats[i].y, normalDangerDistance, 3);
                            drawCircle(allPossibleThreats[i].x, allPossibleThreats[i].y, normalDangerDistance + shiftDistance, 6);
                        }

                        if (allPossibleThreats[i].danger && f.getLastUpdate() - allPossibleThreats[i].dangerTimeOut > 1000) {

                            allPossibleThreats[i].danger = false;
                        }

                        /*if ((enemyCanSplit && enemyDistance < splitDangerDistance) ||
                            (!enemyCanSplit && enemyDistance < normalDangerDistance)) {

                            allPossibleThreats[i].danger = true;
                            allPossibleThreats[i].dangerTimeOut = f.getLastUpdate();
                        }*/

                        //console.log("Figured out who was important.");

                        if ((enemyCanSplit && enemyDistance < splitDangerDistance) || (enemyCanSplit && allPossibleThreats[i].danger)) {

                            badAngles.push(getAngleRange(player[k], allPossibleThreats[i], i, splitDangerDistance));

                        } else if ((!enemyCanSplit && enemyDistance < normalDangerDistance) || (!enemyCanSplit && allPossibleThreats[i].danger)) {

                            badAngles.push(getAngleRange(player[k], allPossibleThreats[i], i, normalDangerDistance));

                        } else if (enemyCanSplit && enemyDistance < splitDangerDistance + shiftDistance) {
                            var tempOb = getAngleRange(player[k], allPossibleThreats[i], i, splitDangerDistance + shiftDistance);
                            var angle1 = tempOb[0];
                            var angle2 = rangeToAngle(tempOb);

                            obstacleList.push([[angle1, true], [angle2, false]]);
                        } else if (!enemyCanSplit && enemyDistance < normalDangerDistance + shiftDistance) {
                            var tempOb = getAngleRange(player[k], allPossibleThreats[i], i, normalDangerDistance + shiftDistance);
                            var angle1 = tempOb[0];
                            var angle2 = rangeToAngle(tempOb);

                            obstacleList.push([[angle1, true], [angle2, false]]);
                        }
                        //console.log("Done with enemy: " + i);
                    }

                    //console.log("Done looking for enemies!");

                    var goodAngles = [];
                    var stupidList = [];

                    for (var i = 0; i < allPossibleViruses.length; i++) {
                        if (player[k].size < allPossibleViruses[i].size) {
                            drawCircle(allPossibleViruses[i].x, allPossibleViruses[i].y, allPossibleViruses[i].size + 10, 3);
                            drawCircle(allPossibleViruses[i].x, allPossibleViruses[i].y, allPossibleViruses[i].size * 2, 6);

                        } else {
                            drawCircle(allPossibleViruses[i].x, allPossibleViruses[i].y, player[k].size + 50, 3);
                            drawCircle(allPossibleViruses[i].x, allPossibleViruses[i].y, player[k].size * 2, 6);
                        }
                    }

                    var sortedInterList = [];
                    var sortedObList = [];

                    for (var i = 0; i < stupidList.length; i++) {
                        //console.log("Adding to sorted: " + stupidList[i][0][0] + ", " + stupidList[i][1][0]);
                        sortedInterList = addAngle(sortedInterList, stupidList[i])

                        if (sortedInterList.length == 0) {
                            break;
                        }
                    }

                    for (var i = 0; i < obstacleList.length; i++) {
                        sortedObList = addAngle(sortedObList, obstacleList[i])

                        if (sortedObList.length == 0) {
                            break;
                        }
                    }

                    var offsetI = 0;
                    var obOffsetI = 1;

                    if (sortedInterList.length > 0 && sortedInterList[0][1]) {
                        offsetI = 1;
                    }
                    if (sortedObList.length > 0 && sortedObList[0][1]) {
                        obOffsetI = 0;
                    }

                    destinationChoices.push([tempMoveX, tempMoveY]);

                    tempPoint[2] = 1;

                }

            return destinationChoices;
        }
    }

    function addWall(listToUse, blob) {
        if (blob.x < f.getMapStartX() + 1000) {
            //LEFT
            //console.log("Left");

            listToUse.push([[135, true], [225, false]]);

            var lineLeft = followAngle(135, blob.x, blob.y, 190 + blob.size);
            var lineRight = followAngle(225, blob.x, blob.y, 190 + blob.size);
            drawLine(blob.x, blob.y, lineLeft[0], lineLeft[1], 5);
            drawLine(blob.x, blob.y, lineRight[0], lineRight[1], 5);
            //drawArc(lineLeft[0], lineLeft[1], lineRight[0], lineRight[1], blob.x, blob.y, 5);
        }
        if (blob.y < f.getMapStartY() + 1000) {
            //TOP
            //console.log("TOP");
            
            listToUse.push([[225, true], [315, false]]);

            var lineLeft = followAngle(225, blob.x, blob.y, 190 + blob.size);
            var lineRight = followAngle(315, blob.x, blob.y, 190 + blob.size);
            drawLine(blob.x, blob.y, lineLeft[0], lineLeft[1], 5);
            drawLine(blob.x, blob.y, lineRight[0], lineRight[1], 5);
        }
        if (blob.x > f.getMapEndX() - 1000) {
            //RIGHT
            //console.log("RIGHT");

            listToUse.push([[315, true], [45, false]]);
            
            var lineLeft = followAngle(315, blob.x, blob.y, 190 + blob.size);
            var lineRight = followAngle(45, blob.x, blob.y, 190 + blob.size);
            drawLine(blob.x, blob.y, lineLeft[0], lineLeft[1], 5);
            drawLine(blob.x, blob.y, lineRight[0], lineRight[1], 5);
        }
        if (blob.y > f.getMapEndY() - 1000) {
            //BOTTOM
            //console.log("BOTTOM");

            listToUse.push([[45, true], [135, false]]);
            
            var lineLeft = followAngle(45, blob.x, blob.y, 190 + blob.size);
            var lineRight = followAngle(135, blob.x, blob.y, 190 + blob.size);
            drawLine(blob.x, blob.y, lineLeft[0], lineLeft[1], 5);
            drawLine(blob.x, blob.y, lineRight[0], lineRight[1], 5);
        }

        return listToUse;
    }

    function screenToGameX(x) {
        return (x - getWidth() / 2) / getRatio() + getX();
    }

    function screenToGameY(y) {
        return (y - getHeight() / 2) / getRatio() + getY();;
    }

    function drawLine(x_1, y_1, x_2, y_2, drawColor) {
        f.drawLine(x_1, y_1, x_2, y_2, drawColor);
    }

    function drawCircle(x_1, y_1, radius, drawColor) {
        f.drawCircle(x_1, y_1, radius, drawColor);
    }

    function screenDistance() {
        var temp = f.getScreenDistance();
        return temp;
    }

    function getDarkBool() {
        return f.getDarkBool();
    }

    function getMassBool() {
        return f.getMassBool();
    }

    function getMemoryCells() {
        return f.getMemoryCells();
    }

    function getCellsArray() {
        return f.getCellsArray();
    }

    function getCells() {
        return f.getCells();
    }

    function getPlayer() {
        return f.getPlayer();
    }

    function getWidth() {
        return f.getWidth();
    }

    function getHeight() {
        return f.getHeight();
    }

    function getRatio() {
        return f.getRatio();
    }

    function getOffsetX() {
        return f.getOffsetX();
    }

    function getOffsetY() {
        return f.getOffsetY();
    }

    function getX() {
        return f.getX();
    }

    function getY() {
        return f.getY();
    }

    function getPointX() {
        return f.getPointX();
    }

    function getPointY() {
        return f.getPointY();
    }

    function getMouseX() {
        return f.getMouseX();
    }

    function getMouseY() {
        return f.getMouseY();
    }

    function getUpdate() {
        return f.getLastUpdate();
    }

    function getMode() {
        return f.getMode();
    }
})(window, jQuery);
