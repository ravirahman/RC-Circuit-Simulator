$(function() {
    console.log("page ready");
    var running = false;

    var c = 1;
    var v = 10;
    var q0 = 0;
    var r = 100;
    var t = 0;
    var starting_t = 0;
    var time_at_last_t = 0;
    var speed = 10;

    var num_charges = 10;


    var voltageInput = $("#voltage");
    var resistanceInput = $("#resistance");
    var capacitanceInput = $("#capacitance");
    var speedInput = $("#speed");
    var q0Input = $("#q0");
    var tInput = $("#t");

    function updateGraph() {
        functionPlot({
            target: '#functionPlot',
            title: "Voltages",
            //width: "100%",
            data: [
                {
                    fn: vcfunc(), //voltage over capacitor
                    graphType: 'polyline',
                    color: voltColor
                }, {
                    fn: vrfunc(), //voltage over resistor
                    graphType: 'polyline',
                    color: resistanceColor
                }, {
                    fn: v.toString(), //total voltage,
                    graphType: 'polyline',
                    color: "black"
                }],
            xAxis: {
                type: 'linear',
                label: 'Time (s)',
                domain: [0, (-1 * r * c * Math.log((0.1 * v * c)/(v * c - q0)))] //go to the 70% value
            },
            yAxis: {
                type: 'linear',
                label: 'Voltage (V)',
                domain: [Math.min(0, v) * 1.1, Math.max(0, v) * 1.1]
            },
            tip: {
                xLine: true,    // dashed line parallel to y = 0
                yLine: true,    // dashed line parallel to x = 0
                renderer: function (x, y, index) {
                    var rUnit = math.unit(y + " V"); //using V since it can't do the omega symbol
                    var rUnitsFormatted = rUnit.format(3); //format to two digits

                    var xUnit = math.unit(x + " s");
                    var xUnitsFormatteed = xUnit.format(3);

                    var base = "(" + xUnitsFormatteed + ", " + rUnitsFormatted + ") ";
                    switch(index) {
                        case 0:
                            return "Capacitor: " + base;
                        case 1:
                            return "Resistor: " +base;
                        case 2:
                            return "Total: " + base;
                    }
                    return base;
                }
            }
        });
        functionPlot({
            target: '#currentPlot',
            title: "Current",
            //width: "100%",
            data: [{
                    fn: currentfunc(), //current
                    graphType: 'polyline',
                    //color: currentColor
                }],
            xAxis: {
                type: 'linear',
                label: 'Time (s)',
                domain: [0, (-1 * r * c * Math.log((0.1 * v * c)/(v * c - q0)))]
            },
            yAxis: {
                type: 'linear',
                label: 'Current (A)',
                domain: [Math.min(0, v/r) * 1.1, Math.max(0, v/r) * 1.1]
            },
            tip: {
                xLine: true,    // dashed line parallel to y = 0
                yLine: true,    // dashed line parallel to x = 0
                renderer: function (x, y, index) {
                    var rUnit = math.unit(y + " A"); //using V since it can't do the omega symbol
                    var rUnitsFormatted = rUnit.format(3); //format to two digits

                    var xUnit = math.unit(x + " s");
                    var xUnitsFormatteed = xUnit.format(3);

                    var base = "(" + xUnitsFormatteed + ", " + rUnitsFormatted + ") ";
                    return base;
                }
            }
        });
        return;
    }
    updateGraph();


    function arrow(graphics, sx, sy, direction) {
        if(direction.toUpperCase() === "U") {
            graphics.moveTo(sx - x(0.01), sy + y(0.01));
            graphics.lineTo(sx, sy);
            graphics.lineTo(sx + x (0.01), sy + y(0.01));
        }
        if(direction.toUpperCase() === "D") {
            graphics.moveTo(sx - x(0.01), sy - y(0.01));
            graphics.lineTo(sx, sy);
            graphics.lineTo(sx + x (0.01), sy - y(0.01));
        }
        if(direction.toUpperCase() === "L") {
            graphics.moveTo(sx + x(0.01), sy - y(0.01));
            graphics.lineTo(sx, sy);
            graphics.lineTo(sx + x (0.01), sy + y(0.01));
        }
        if(direction.toUpperCase() === "R") {
            graphics.moveTo(sx - x(0.01), sy - y(0.01));
            graphics.lineTo(sx, sy);
            graphics.lineTo(sx - x (0.01), sy + y(0.01));
        }
    }


    var inputs = [voltageInput, resistanceInput, capacitanceInput, speedInput, q0Input, tInput];

    var doneTypingInterval = 500;  //time in ms, 5 second for example

    for (var i = 0; i < inputs.length; i++) {
        //setup before functions
        var $input = inputs[i]; // = $('#myInput');
        (function($input) {
            var typingTimer;                //timer identifier
            //on keyup, start the countdown
            $input.on('keyup', function () {
                clearTimeout(typingTimer);
                typingTimer = setTimeout(doneTyping, doneTypingInterval);
            });

//on keydown, clear the countdown
            $input.on('keydown', function () {
                clearTimeout(typingTimer);
            });

            $input.on('blur', doneTyping);

//user is "finished typing," do something
            function doneTyping () {
                if ($input === voltageInput) {
                    v = parseFloat(voltageInput.val()) || 0;
                    if (v != voltageInput.val()) {
                        voltageInput.val(v);
                    }
                    updateGraph();
                    return;
                }
                if ($input === resistanceInput) {
                    r = parseFloat(resistanceInput.val()) || 0;
                    if (r != resistanceInput.val()) {
                        resistanceInput.val(r);
                    }
                    updateGraph();
                    return;
                }
                if ($input === capacitanceInput) {
                    c = parseFloat(capacitanceInput.val()) || 0;
                    if (c != capacitanceInput.val()) {
                        capacitanceInput.val(c);
                    }
                    updateGraph();
                    return;
                }
                if ($input === speedInput) {
                    speed = parseFloat(speedInput.val()) || 0;
                    if (speed != speedInput.val()) {
                        speedInput.val(speed);
                    }
                    updateGraph();
                    return;
                }
                if ($input === q0Input) {
                    q0 = parseFloat(q0Input.val()) || 0;
                    if (q0 != q0Input.val()) {
                        q0Input.val(q0);
                    }
                    updateGraph();
                    return;
                }
                if ($input === tInput) {
                    var new_starting_t = parseFloat(tInput.val()) || 0;
                    t = new_starting_t - starting_t; //temporarily set t to the new value so we can calculate the change in charge
                    q0 = calculateCharge();
                    t = 0; //reset t back to 0.
                    starting_t = new_starting_t;
                    q0Input.val(q0);
                    if (starting_t !== tInput.val()) {
                        tInput.val(starting_t);
                    }
                    updateGraph();
                    return;
                }

            }
        })($input);


    }

    var voltColor = "#d9534f";
    var currentColor = "#0275d8";
    var resistanceColor = "#f0ad4e";

    var canvas = document.getElementById("canvas");
    // Set up CSS size if it's not set up already
    var width = $("#content-column").width() * 0.9;
    var height = $(window).height() * 0.8;
    if (!canvas.style.width)
        canvas.style.width = width + 'px';
    if (!canvas.style.height)
        canvas.style.height = height + 'px';

    var scaleFactor = 2;
    canvas.width = Math.ceil(width * scaleFactor);
    canvas.height = Math.ceil(height * scaleFactor);
    var ctx = canvas.getContext('2d');
    ctx.scale(scaleFactor, scaleFactor);

    function x(scaledWidth) {
        return width * scaledWidth * 2;
    }

    function y(scaledHeight) {
        return scaledHeight * height * 2;
    }

    var stage = new createjs.Stage("canvas");
    //stage.scaleX = 0.5; //retina
    //stage.scaleY = 0.5; //retina

    //"etch" the wires into the circuit
    var wires = new createjs.Graphics();
    wires.setStrokeStyle(1);
    wires.beginStroke("#ffffff");
    wires.beginFill("#000000");
    wires.drawRect(x(0.2), y(0.1), x(0.6), y(0.8)); //x, y, width, height

    var wiresShape = new createjs.Shape(wires);
    stage.addChild(wiresShape);


    var voltLines = new createjs.Graphics();
    voltLines.setStrokeStyle(1);
    //paint black over the wire where we will be adding our voltage source
    voltLines.beginFill("#000000");
    voltLines.beginStroke("#000000");
    voltLines.drawRect(x(0.19), y(0.47), x(0.02), y(0.09));
    //now draw the voltage source
    voltLines.beginStroke("#ffffff");
    voltLines.beginFill("#ffffff");
    voltLines.drawRect(x(0.17), y(0.47), x(0.06), y(0));
    voltLines.drawRect(x(0.185), y(0.50), x(0.03), y(0));
    voltLines.drawRect(x(0.17), y(0.53), x(0.06), y(0));
    voltLines.drawRect(x(0.185), y(0.56), x(0.03), y(0));

    //go through and add lines indicating the direction of voltage. These don't change; only the arrow tips do (depending on direction)
    //voltLines.moveTo(x(0.14), y(0.45));
    //voltLines.lineTo(x(0.14), y(0.55));
    //arrow(cva, x(0.14), y(0.45), "U");
    //arrow(ccva, x(0.14), y(0.55), "D");


    //voltLines.moveTo(x(0.45), y(0.05));
    //voltLines.lineTo(x(0.55), y(0.05));
    //arrow(ccva, x(0.45), y(0.05), "L");
    //arrow(cva, x(0.55), y(0.05), "R");


    //voltLines.drawRect(x(0.14), y(0.4), x(0), y(0.2)); //this is for the slider

    var voltLinesShape = new createjs.Shape(voltLines);
    stage.addChild(voltLinesShape);

    /*var cvaShape = new createjs.Shape(cva);
    var ccvaShape = new createjs.Shape(ccva);
    ccvaShape.visible = false;
    stage.addChild(cvaShape);
    stage.addChild(ccvaShape);*/

    var supplyVoltmeter = new createjs.Graphics();
    supplyVoltmeter.setStrokeStyle(1);
    supplyVoltmeter.beginFill("#000000");
    supplyVoltmeter.beginStroke("#ffffff");
    supplyVoltmeter.moveTo(x(0.2), y(0.40));
    supplyVoltmeter.lineTo(x(0.35), y(0.40));
    supplyVoltmeter.lineTo(x(0.35), y(0.45));
    supplyVoltmeter.moveTo(x(0.35), y(0.57));
    supplyVoltmeter.lineTo(x(0.35), y(0.63));
    supplyVoltmeter.lineTo(x(0.20), y(0.63));

    supplyVoltmeter.beginStroke(voltColor);
    supplyVoltmeter.drawCircle(x(0.35), y(0.51), y(0.06));

    var supplyVoltmeterShape = new createjs.Shape(supplyVoltmeter);
    stage.addChild(supplyVoltmeterShape);



    var vsm = new createjs.Graphics();
    vsm.setStrokeStyle(1);
    vsm.beginStroke(voltColor);
    vsm.moveTo(x(0), y(-0.02));
    vsm.lineTo(x(0), y(0.02));
    arrow(vsm, x(0), y(0.02), "D");

    var vsms = new createjs.Shape(vsm);
    vsms.x = x(0.385);
    vsms.y = y(0.51);
    stage.addChild(vsms);

    var supplyVoltmeterUnit = new createjs.Text("", "40px Arial", voltColor);
    supplyVoltmeterUnit.x = x(0.35);
    supplyVoltmeterUnit.y = y(0.55);
    supplyVoltmeterUnit.textAlign = "center";
    supplyVoltmeterUnit.textBaseline = "alphabetic";
    stage.addChild(supplyVoltmeterUnit);


    var supplyVoltmeterValue = new createjs.Text("", "40px Arial", voltColor);
    supplyVoltmeterValue.x = x(0.35);
    supplyVoltmeterValue.y = y(0.50);
    supplyVoltmeterValue.textAlign = "center";
    supplyVoltmeterValue.textBaseline = "alphabetic";
    stage.addChild(supplyVoltmeterValue);


    var resistor = new createjs.Graphics();
    resistor.setStrokeStyle(1);
    //paint black over the wire where we will be adding our voltage source
    resistor.beginFill("#000000");
    resistor.beginStroke("#000000");
    resistor.drawRect(x(0.45), y(0.09), x(0.1), y(0.02));
    //now draw the lines
    resistor.beginStroke("#ffffff");
    //
    resistor.moveTo(x(0.45), y(0.1));
    resistor.lineTo(x(0.46), y(0.11));
    resistor.lineTo(x(0.47), y(0.09));
    resistor.lineTo(x(0.48), y(0.11));
    resistor.lineTo(x(0.49), y(0.09));
    resistor.lineTo(x(0.50), y(0.11));
    resistor.lineTo(x(0.51), y(0.09));
    resistor.lineTo(x(0.52), y(0.11));
    resistor.lineTo(x(0.53), y(0.09));
    resistor.lineTo(x(0.54), y(0.11));
    resistor.lineTo(x(0.55), y(0.1));
    //resistor.beginFill("#ffffff");
    //resistor.drawRect(x(0.55), y(0.14), x(0), y(0.13)); //this is for the slider


    var resistorShape = new createjs.Shape(resistor);
    stage.addChild(resistorShape);

    var resistorVoltmeter = new createjs.Graphics();
    resistorVoltmeter.setStrokeStyle(1);
    resistorVoltmeter.beginFill("#000000");
    resistorVoltmeter.beginStroke("#ffffff");
    resistorVoltmeter.moveTo(x(0.3), y(0.1));
    resistorVoltmeter.lineTo(x(0.3), y(0.25));
    resistorVoltmeter.lineTo(x(0.33), y(0.25));
    resistorVoltmeter.moveTo(x(0.45), y(0.25));
    resistorVoltmeter.lineTo(x(0.48), y(0.25));
    resistorVoltmeter.moveTo(x(0.60), y(0.25));
    resistorVoltmeter.lineTo(x(0.63), y(0.25));
    resistorVoltmeter.lineTo(x(0.63), y(0.1));

    resistorVoltmeter.beginStroke(voltColor);
    resistorVoltmeter.drawCircle(x(0.54), y(0.25), x(0.06));

    resistorVoltmeter.beginStroke(resistanceColor);
    resistorVoltmeter.drawCircle(x(0.39), y(0.25), x(0.06));

    var resistorVoltmeterShape = new createjs.Shape(resistorVoltmeter);
    stage.addChild(resistorVoltmeterShape);

    var rvd = new createjs.Graphics();
    rvd.setStrokeStyle(1);
    rvd.beginStroke(voltColor);
    rvd.moveTo(x(-0.02), y(0));
    rvd.lineTo(x(0.02), y(0));
    arrow(rvd, x(0.02), y(0), "R");
    var rvdShape = new createjs.Shape(rvd);
    rvdShape.x = x(0.54);
    rvdShape.y = y(0.21);
    stage.addChild(rvdShape);

    var resistorVoltmeterUnit = new createjs.Text("", "40px Arial", voltColor);
    resistorVoltmeterUnit.x = x(0.54);
    resistorVoltmeterUnit.y = y(0.29);
    resistorVoltmeterUnit.textAlign = "center";
    resistorVoltmeterUnit.textBaseline = "alphabetic";
    stage.addChild(resistorVoltmeterUnit);


    var resistorVoltmeterValue = new createjs.Text("", "40px Arial", voltColor);
    resistorVoltmeterValue.x = x(0.54);
    resistorVoltmeterValue.y = y(0.25);
    resistorVoltmeterValue.textAlign = "center";
    resistorVoltmeterValue.textBaseline = "alphabetic";
    stage.addChild(resistorVoltmeterValue);

    var resistorOhmmeterUnit = new createjs.Text("", "40px Arial", resistanceColor);
    resistorOhmmeterUnit.x = x(0.39);
    resistorOhmmeterUnit.y = y(0.29);
    resistorOhmmeterUnit.textAlign = "center";
    resistorOhmmeterUnit.textBaseline = "alphabetic";
    stage.addChild(resistorOhmmeterUnit);


    var resistorOhmmeterValue = new createjs.Text("", "40px Arial", resistanceColor);
    resistorOhmmeterValue.x = x(0.39);
    resistorOhmmeterValue.y = y(0.25);
    resistorOhmmeterValue.textAlign = "center";
    resistorOhmmeterValue.textBaseline = "alphabetic";
    stage.addChild(resistorOhmmeterValue);


    var capicatorVoltmeter = new createjs.Graphics();
    capicatorVoltmeter.setStrokeStyle(1);
    capicatorVoltmeter.beginFill("#000000");
    capicatorVoltmeter.beginStroke("#ffffff");
    capicatorVoltmeter.moveTo(x(0.8), y(0.4));
    capicatorVoltmeter.lineTo(x(0.65), y(0.4));
    capicatorVoltmeter.lineTo(x(0.65), y(0.44));
    capicatorVoltmeter.moveTo(x(0.65), y(0.56));
    capicatorVoltmeter.lineTo(x(0.65), y(0.6));
    capicatorVoltmeter.lineTo(x(0.8), y(0.6));

    capicatorVoltmeter.beginStroke(voltColor);
    capicatorVoltmeter.drawCircle(x(0.65), y(0.5), y(0.06));

    var capicatorVoltmeterShape = new createjs.Shape(capicatorVoltmeter);
    stage.addChild(capicatorVoltmeterShape);

    var cvd = new createjs.Graphics();
    cvd.setStrokeStyle(1);
    cvd.beginStroke(voltColor);
    cvd.moveTo(x(0), y(-0.02));
    cvd.lineTo(x(0), y(0.02));
    arrow(cvd, x(0), y(0.02), "D");
    var cvdShape = new createjs.Shape(cvd);
    cvdShape.x = x(0.685);
    cvdShape.y = y(0.5);
    stage.addChild(cvdShape);

    var cVoltmeterUnit = new createjs.Text("", "40px Arial", voltColor);
    cVoltmeterUnit.x = x(0.65);
    cVoltmeterUnit.y = y(0.54);
    cVoltmeterUnit.textAlign = "center";
    cVoltmeterUnit.textBaseline = "alphabetic";
    stage.addChild(cVoltmeterUnit);


    var cVoltmeterValue = new createjs.Text("", "40px Arial", voltColor);
    cVoltmeterValue.x = x(0.65);
    cVoltmeterValue.y = y(0.49);
    cVoltmeterValue.textAlign = "center";
    cVoltmeterValue.textBaseline = "alphabetic";
    stage.addChild(cVoltmeterValue);

    var currentMeter = new createjs.Graphics();
    currentMeter.setStrokeStyle(1);
    currentMeter.beginFill("#000000");
    currentMeter.beginStroke(currentColor);
    currentMeter.drawCircle(x(0.5), y(0.9), x(0.06));

    var currentMeterShape = new createjs.Shape(currentMeter);
    stage.addChild(currentMeterShape);

    var cd = new createjs.Graphics();
    cd.setStrokeStyle(1);
    cd.beginStroke(currentColor);
    cd.moveTo(x(-0.02), y(0.0));
    cd.lineTo(x(0.02), y(0));
    arrow(cd, x(-0.02), y(0), "L");

    var cdShape = new createjs.Shape(cd);
    cdShape.x = x(0.5);
    cdShape.y = y(0.86);
    stage.addChild(cdShape);

    var cMeterUnit = new createjs.Text("", "40px Arial", currentColor);
    cMeterUnit.x = x(0.5);
    cMeterUnit.y = y(0.93);
    cMeterUnit.textAlign = "center";
    cMeterUnit.textBaseline = "alphabetic";
    stage.addChild(cMeterUnit);


    var cMeterValue = new createjs.Text("", "40px Arial", currentColor);
    cMeterValue.x = x(0.5);
    cMeterValue.y = y(0.9);
    cMeterValue.textAlign = "center";
    cMeterValue.textBaseline = "alphabetic";
    stage.addChild(cMeterValue);

    var capacitor = new createjs.Graphics();
    capacitor.setStrokeStyle(1);
    //paint black over the wire where we will be adding our voltage source
    capacitor.beginFill("#000000");
    capacitor.beginStroke("#000000");
    capacitor.drawRect(x(0.79), y(0.49), x(0.02), y(0.02));
    capacitor.beginStroke("#ffffff");
    capacitor.beginFill("#ffffff");
    capacitor.drawRect(x(0.77), y(0.49), x(0.06), y(0.0));
    capacitor.drawRect(x(0.77), y(0.51), x(0.06), y(0.0));
    //capacitor.drawRect(x(0.85), y(0.45), x(0), y(0.13)); //this is for the slider

    var capacitorShape = new createjs.Shape(capacitor);
    stage.addChild(capacitorShape);

    var voltageUnit = math.unit(v + "V");
    var voltageUnitsFormatted = voltageUnit.format(2); //format to two digits


    createjs.Ticker.addEventListener("tick", function() {
        var voltageUnit = math.unit(v + "V");
        var voltageUnitsFormatted = voltageUnit.format(3); //format to two digits
        var voltageUnitSplit = voltageUnitsFormatted.split(" ");
        supplyVoltmeterValue.text = Math.abs(voltageUnitSplit[0]);
        supplyVoltmeterUnit.text = voltageUnitSplit[1]; //the units part

        var rUnit = math.unit(r + " V"); //using V since it can't do the omega symbol
        var rUnitsFormatted = rUnit.format(3); //format to two digits
        var rUnitSplit = rUnitsFormatted.split(" ");
        resistorOhmmeterValue.text = rUnitSplit[0]; //no absolute value
        resistorOhmmeterUnit.text = rUnitSplit[1].replace(/V/g, "Ω"); //the units part

        if (v >= 0 && vsms.rotation === 180) {
            createjs.Tween.get(vsms).to({rotation: 0}, 200);
        }
        if (v < 0 && vsms.rotation === 0) {
            createjs.Tween.get(vsms).to({rotation: 180}, 200);
        }


        var new_charge = calculateCharge(); //build it up on the plate
        var new_current = calculateCurrent(new_charge); //this is proportional to velocity
        var new_vc = calculateVoltageOverCapicator(new_charge);
        var new_vr = calculateVoltageOverResistor(new_vc);

        var resistorVoltageUnit = math.unit(new_vr + "V");
        var resistorvoltageUnitsFormatted = resistorVoltageUnit.format(3); //format to two digits
        var rvoltageUnitSplit = resistorvoltageUnitsFormatted.split(" ");
        resistorVoltmeterValue.text = Math.abs(rvoltageUnitSplit[0]);
        resistorVoltmeterUnit.text = rvoltageUnitSplit[1]; //the units part


        if (new_vr >= 0 && rvdShape.rotation === 180) {
            createjs.Tween.get(rvdShape).to({rotation: 0}, 200);
        }
        if (new_vr < 0 && rvdShape.rotation === 0) {
            createjs.Tween.get(rvdShape).to({rotation: 180}, 200);
        }


        var cVoltageUnit = math.unit(new_vc + "V");
        var cvoltageUnitsFormatted = cVoltageUnit.format(3); //format to two digits
        var cvoltageUnitSplit = cvoltageUnitsFormatted.split(" ");
        cVoltmeterValue.text = Math.abs(cvoltageUnitSplit[0]);
        cVoltmeterUnit.text = cvoltageUnitSplit[1]; //the units part

        if (new_vc >= 0 && cvdShape.rotation === 180) {
            createjs.Tween.get(cvdShape).to({rotation: 0}, 200);
        }
        if (new_vc < 0 && cvdShape.rotation === 0) {
            createjs.Tween.get(cvdShape).to({rotation: 180}, 200);
        }

        var cUnit = math.unit(new_current + "A");
        var cUnitsFormatted = cUnit.format(3); //format to two digits
        var cUnitSplit = cUnitsFormatted.split(" ");
        cMeterValue.text = Math.abs(cUnitSplit[0]);
        cMeterUnit.text = cUnitSplit[1]; //the units part


        if (new_current >= 0 && cdShape.rotation === 180) {
            createjs.Tween.get(cdShape).to({rotation: 0}, 200);
        }
        if (new_current < 0 && cdShape.rotation === 0) {
            createjs.Tween.get(cdShape).to({rotation: 180}, 200);
        }

        var max_charge = v * c; //cv=q
        var expected_charges = Math.abs(Math.round(new_charge / max_charge * num_charges));
        while (expected_charges < neg_charges.length) { //if you have too many, remove some!
            removeCharge();
        }
        while (expected_charges > neg_charges.length) { //if you have too few, add some in!
            addCharge();
        }


        if (running) {
            var new_time = (new Date).getTime() / 1000;
            if (time_at_last_t) {
                var seconds_elapsed = new_time - time_at_last_t;
                t += seconds_elapsed * speed; //set t to what it should be
            }


            time_at_last_t = new_time;
            tInput.val(parseFloat(t) + parseFloat(starting_t));
            q0Input.val(new_charge);
        }
        stage.update();
    });

    var neg_charges = [];
    var free_neg_charges = [];
    var pos_charges = [];
    var free_pos_charges = [];

    for (i = 0; i < num_charges * 2; i++) {
        var negCharge = new createjs.Graphics();
        negCharge.setStrokeStyle(1);
        //paint black over the wire where we will be adding our voltage source
        negCharge.beginFill(currentColor); //blue for negative; red for positive
        negCharge.beginStroke("#ffffff");
        negCharge.drawCircle(0, 0, x(0.005));
        negCharge.moveTo(x(-0.0025), 0);
        negCharge.lineTo(x(0.0025), 0);
        var negChargeShape = new createjs.Shape(negCharge);
        negChargeShape.x = x(0.8);
        negChargeShape.alpha = 0;
        stage.addChild(negChargeShape);

        free_neg_charges.push(negChargeShape);

        var posCharge = new createjs.Graphics();
        posCharge.setStrokeStyle(1);
        //paint black over the wire where we will be adding our voltage source
        posCharge.beginFill(voltColor); //blue for negative; red for positive
        posCharge.beginStroke("#ffffff");
        posCharge.drawCircle(0, 0, x(0.005));
        posCharge.moveTo(x(-0.0025), 0);
        posCharge.lineTo(x(0.0025), 0);
        posCharge.moveTo(0, x(-0.0025)); //using x in the y since the circle is drawn in x coordinates
        posCharge.lineTo(0, x(0.0025)); //using x in the y since the circle is drawn in x coordinates
        var posChargeShape = new createjs.Shape(posCharge);
        posChargeShape.x = x(0.8);
        posChargeShape.alpha = 0;
        stage.addChild(posChargeShape);
        free_pos_charges.push(posChargeShape);

    }


    function addCharge() { //sign is either 1 or -1 -- if it's 1, add it normally.
        if (free_pos_charges.length <= 0 || free_neg_charges.length <= 0) {
            return; //we're out of charges
        }
        negChargeShape = free_neg_charges.pop();//keep all of our charges so we don't need to create and destroy them. eliminates memory leaks
        posChargeShape = free_pos_charges.pop();

        neg_charges.splice(Math.ceil(neg_charges.length/2), 0, negChargeShape);
        pos_charges.splice(Math.ceil(pos_charges.length/2), 0, posChargeShape);
        posChargeShape.x = x(0.8);
        posChargeShape.alpha = 0;
        negChargeShape.x = x(0.8);
        negChargeShape.alpha = 0;

        var currentCharge = calculateCharge();
        if (currentCharge >= 0) { //pos charge animates in from the top; negative charge animates in from the bottom
            posChargeShape.y = y(0.4); ///goes to 0.485
            createjs.Tween.get(posChargeShape).to({y: y(0.485), alpha: 1}, 200).call(rearrangePosCharge);
            negChargeShape.y = y(0.6); //goes to 0.515
            createjs.Tween.get(negChargeShape).to({y: y(0.515), alpha: 1}, 200).call(rearrangeNegCharge);
        }
        else {
            posChargeShape.y = y(0.6);
            createjs.Tween.get(posChargeShape).to({y: y(0.515), alpha: 1}, 200).call(rearrangePosCharge);
            negChargeShape.y = y(0.4);
            createjs.Tween.get(negChargeShape).to({y: y(0.485), alpha: 1}, 200).call(rearrangeNegCharge);
        }
    }

    function rearrangePosCharge() {
        return rearrangeCharge(pos_charges);

    }
    function rearrangeNegCharge() {
        return rearrangeCharge(neg_charges);
    }

    function rearrangeCharge(charges) {
        var charge_count = charges.length;
        if (charge_count === 0) {
            return;
        }
        var distance = x(0.06);
        if (charge_count === 1) {
            createjs.Tween.get(charges[0]).to({x: x(0.8)}, 200);
            return;
        }
        var spacing = distance / (charge_count - 1);
        for (var i = 0; i < charges.length; i++) {
            var charge = charges[i];
            createjs.Tween.get(charge).to({x: (x(0.77) + i * spacing)}, 200)
        }
    }

    function removeCharge() {
        if (neg_charges.length <= 0 || pos_charges.length <= 0) {
            return;
        }
        var index = Math.floor(neg_charges.length/2);

        var negChargeShape = neg_charges.splice(index, 1)[0];
        var posChargeShape = pos_charges.splice(index, 1)[0];
        var currentCharge = calculateCharge();
        if (currentCharge >= 0) { //pos charge animates in from the top; negative charge animates in from the bottom
            //posChargeShape.y = y(0.4);
            //negChargeShape.y = y(0.6);
            createjs.Tween.get(posChargeShape).to({y: y(0.4), alpha: 0}, 200);
            createjs.Tween.get(negChargeShape).to({y: y(0.6), alpha: 0}, 200);
        }
        else {
            createjs.Tween.get(posChargeShape).to({y: y(0.6), alpha: 0}, 200);
            createjs.Tween.get(negChargeShape).to({y: y(0.4), alpha: 0}, 200);
        }
        free_neg_charges.push(negChargeShape);
        free_pos_charges.push(posChargeShape);
        rearrangeNegCharge();
        rearrangePosCharge();

    }



    function calculateCharge() {
        return v * c + (q0 - v*c) * math.exp((-1 * t) / (r * c));
    }

    function chargefunc() {
        return (v * c) + " + " + (q0 - v * c) + "* " + Math.E + "^(-x/" + (r * c) + ")"
    }

    function calculateCurrent(charge) {
        if (!charge) {
            charge = calculateCharge();
        }
        //dq/dt = I = (CV-Q)/RC
        return (c * v - charge) / (r * c);
    }

    function currentfunc() {
        return ((v * c - q0)/(r * c)) + " * " + Math.E + "^(-x/" + (r * c) + ")"
    }

    function calculateVoltageOverCapicator(charge) { //pass in for a faster runtime
        if (!charge) {
            charge = calculateCharge();
        }
        //CV=Q
        //V=Q/C
        return charge / c;
    }

    function vcfunc() {
        return (v) + " + " + (q0/c - v) + "* " + Math.E + "^(-x/" + (r * c) + ")"
    }

    function calculateVoltageOverResistor(v_c) {
        if (!v_c) {
            v_c = calculateVoltageOverCapicator();
        }
        return v - v_c;
    }

    function vrfunc() {
        return (v - q0/c) + "* " + Math.E + "^(-x/" + (r * c) + ")"
    }


    $("#reset").click(function(){
        q0 = 0;
        v = 10;
        r = 100;
        running = false;
        q0Input.prop('disabled', false);
        tInput.prop('disabled', false);
        time_at_last_t = undefined;
        c = 1;
        speed = 0.1;
        t = 0;
        starting_t = 0;
        voltageInput.val(v);
        resistanceInput.val(r);
        q0Input.val(q0);
        tInput.val(t);
        capacitanceInput.val(c);
        speedInput.val(speed);
    });


    $("#pause").click(function(){
        running = false;
        time_at_last_t = undefined;
        starting_t = parseFloat(tInput.val()) || 0;
        q0 = calculateCharge();
        t = 0;
        q0Input.val(q0);
        q0Input.prop('disabled', false);
        tInput.prop('disabled', false);
        $("#play").prop('disabled', false);
        $("#pause").prop('disabled', true);
    });

    $("#play").click(function(){
        time_at_last_t = (new Date).getTime() / 1000;
        t = 0;
        running = true;
        q0Input.prop('disabled', true);
        tInput.prop('disabled', true);
        $("#play").prop('disabled', true);
        $("#pause").prop('disabled', false);
    });



    //now configure the graphs

});





