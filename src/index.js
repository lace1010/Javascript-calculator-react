// I added { useState } so hook could be used (sololearn)
import React, { useState } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import reportWebVitals from "./reportWebVitals";

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

//Start code here
/* could also use this regex /\-|\+|\*|\//. Would do this if I including keyPress 
as \W would take all special characters, but don't have to as I am only doing buttons 
that can be clicked and there are only these options so \W is more elegant */
const endsWithOperator = /(\W)$/,
  endsWithSubtract = /-$/,
  endsWithAdd = /\+$/,
  endsWithOperatorNotSubtract = /(\+|\*|\/)$/,
  operatorNotSubtract = /(\+|\*|\/)/,
  endsWithTwoOperators = /((-|\+|\*|\/){2})$/,
  operatorRegex = /(-|\+|\*|\/)/, // In parenthesis because don't want to get rid of them when splitting the array later in signChange()
  clearStyle = { backgroundColor: "#dd2b2b" },
  signDecimalChange = { backgroundColor: "#525252" },
  operatorStyle = { backgroundColor: "#fc8c30" };

function MyCalculator() {
  const [output, setOutput] = useState("0"); // Set output as a string because formula is being evaluated with eval()
  const [formula, setFormula] = useState("");

  function numberOperatorClick(e) {
    if (output.length < 16 && formula.length <= 25) {
      // If output is less than 16 digits handle formula
      handleFormula(e);
    } else if (formula.length > 25) {
      alert("Formula Limit Met.");
    } else {
      alert("Digit Limit Met.");
    }
  }

  function decimalClick(e) {
    // If output (current number) doesn't have a decimal then handleFormula(e) to add it.
    if (!output.includes(".")) {
      handleFormula(e);
    }
    // Will not perorm anything if output (current number) already has a decimal.
  }

  function allClearClick() {
    setOutput("0");
    setFormula("");
  }

  function clearOneClick() {
    setOutput(output.slice(0, -1)); // Gets rid of last character on string
    setFormula(formula.slice(0, -1)); // Gets rid of last character on string
    // in slice positive numbers are relative to the beggining and negative numbers are relative to the end
  }

  function percentageClick() {
    // Divide output by 100 and change it to a string for future manipulation.
    setOutput((output / 100).toString());
    // Set formula to the number that is being changed to a percentage and add the string "/ 100" to show what you're doing in formula.
    setFormula(output + "/ 100 =" + (output / 100).toString());
  }

  function equalsClick() {
    // If equal sign has been clicked then do not add to formula
    if (operatorNotSubtract.test(formula[0])) {
      alert("First item in formula can not be an operator");
    }
    // If the last character in formula is +.
    else if (endsWithAdd.test(formula)) {
      // Add a zero to end of formula. For example, 9+ turns into 9 + 0 so now eval will work.
      const evaluation = eval((formula + "0").replace("--", "+")); // Getting the evaluation number
      const evaluationNumber = parseFloat(evaluation.toFixed(6)); // toFixed(6) rounds it to 6 decimal places. parseFloat() gets rid of the extra zeros we don't need. For exampe, without parseFloat 9*5 = 45.000000
      setOutput(evaluationNumber.toString()); // eval() takes a string equation and returns its' value.
      // eval returns a number so need to convert it back to a string to use includes() in handleFormula()

      setFormula(formula + "0=" + evaluationNumber.toString());
    }
    // if the last character in formula is an operator not +. We add one
    else if (endsWithOperator.test(formula)) {
      // Add a one to end of formula. For example, 9/ turns into 9/1 so now eval will work.
      const evaluation = eval((formula + "1").replace("--", "+")); // Getting the evaluation number
      const evaluationNumber = parseFloat(evaluation.toFixed(6)); // toFixed(6) rounds it to 6 decimal places. parseFloat() gets rid of the extra zeros we don't need. For exampe, without parseFloat 9*5 = 45.000000
      setOutput(evaluationNumber.toString()); // eval() takes a string equation and returns its' value.
      // eval returns a number so need to convert it back to a string to use includes() in handleFormula()

      setFormula(formula + "1=" + evaluationNumber.toString());
    }

    // If formula doesn't have the equal sign already
    else if (!formula.includes("=")) {
      const evaluation = eval(formula.replace("--", "+")); // Getting the evaluation number
      const evaluationNumber = parseFloat(evaluation.toFixed(6)); // toFixed(6) rounds it to 6 decimal places. parseFloat() gets rid of the extra zeros we don't need. For exampe, without parseFloat 9*5 = 45.000000
      setOutput(evaluationNumber.toString()); // eval() takes a string equation and returns its' value.
      // eval returns a number so need to convert it back to a string to use includes() in handleFormula()

      setFormula(formula + "=" + evaluationNumber.toString());
    }
  }

  function handleFormula(event) {
    const eventValue = event.target.value;
    const formulaArray = formula.split(operatorRegex);
    // console.log(formulaArray); // used to see if number with multiple digits is the last index after operator is clicked

    // If the previous button pushed was 0 (or first button in formula sequence)
    // Handles when a number begins with 0 and shouldn't
    if (output === "0") {
      setOutput(eventValue); //Output gets rid of the 0 in front and resets output as the eventValue
      if (formula === "") {
        //We use this if statement for the first run so when first clicking a button the formula will be set as eventValue
        setFormula(eventValue);
      }
      // if an equation equals 0 and operator is then clicked will make calculator read 0 then operator Clicked. Ex: 4-4=0 => 0(operatorClicked)
      else if (operatorRegex.test(eventValue)) {
        setFormula(output + eventValue);
      }
      // Formula is the same except we replace the previous event which was '0' with the eventValue. So 09 => 9
      else {
        setFormula(formula.replace("0", eventValue));
      }
    }

    // If the first button clicked is an operator
    else if (formula === "" && operatorRegex.test(eventValue)) {
      alert("An operator can not go first in formula");
    }

    // If formula has an "=" and an operator is clicked
    else if (formula.includes("=") && operatorRegex.test(eventValue)) {
      // Don't need to set new output as we want to keep the answer of previous answer as the output
      setFormula(output + eventValue); // Sets formula as previous answer and operator clicked
    }

    // if formula has an "=" and a number is clicked reset output and formula to eventValue. Essentially, resets the calculator except new number is first click this time.
    else if (formula.includes("=")) {
      setOutput(eventValue);
      setFormula(eventValue);
    }

    // If the last button was a operator not (-) && the eventValue is not subtract
    else if (
      endsWithOperatorNotSubtract.test(formula) &&
      operatorNotSubtract.test(eventValue)
    ) {
      setOutput(eventValue);
      setFormula(
        operatorNotSubtract.test(eventValue) &&
          endsWithOperatorNotSubtract.test(formula)
          ? formula.slice(0, -1) + eventValue // slice (0, -1) cuts off last character and then we replace it with eventValue
          : [...formulaArray, eventValue].join("")
      );
    }

    // If previous button is - and next button is operator we replace the - with the eventValue. This way equations like 9 - * 3 do not exist...
    else if (
      endsWithSubtract.test(formula) &&
      operatorNotSubtract.test(eventValue)
    ) {
      setOutput(eventValue);
      setFormula(formula.slice(0, -2) + eventValue); // Slice(0,-2) cuts off last two characters of formula in this case (an operator and -) then we add the eventValue
    }

    // If formula has two operators in a row at end and the next event is an operator (handles cases when - is involved as the second operator.)
    else if (
      endsWithTwoOperators.test(formula) &&
      operatorRegex.test(eventValue)
    ) {
      //Don't need to put anything here as we just want to keep same output and formula if formula ends with two operators and an operator is the eventValue
      /* We don't need to change formula as this else if statement is handling when formula ends with two operators (last operator is '-') and eventValue is '-'. Thus formula doesn't change.*/
    }

    // if formula has an operator we split the formulaArray into values split by operators.
    else if (operatorRegex.test(formula)) {
      // Thus if a number with more than one digit is used after an operator the output would be just that number and not the whole formula
      setOutput(formulaArray[formulaArray.length - 1] + eventValue); // The formulaArray index after operator and adding eventValue () if index = "" then just produces eventValaue as output
      setFormula(formula + eventValue);
    }

    // If the event being clicked is an operator
    else if (operatorRegex.test(eventValue)) {
      setOutput(eventValue); // Output value is simply the operator clicked
      setFormula(formula + eventValue); // add the operator to the formula
    }

    // If just another number is called
    else {
      setOutput(formula + eventValue);
      setFormula(formula + eventValue);
    }
  }

  return (
    <div>
      <h1 id="header">Javascript Calculator</h1>
      <div id="calculator-container">
        <div id="output-formula-container">
          <Output answer={output} />
          <Formula formula={formula} />
        </div>
        {/*properties passed have the function we want to use when clicked. So in Button 
        component we pass these props and set onClikc={props.(property name we set)} */}
        <Buttons
          numberOperator={numberOperatorClick}
          allClear={allClearClick}
          clearOne={clearOneClick}
          decimal={decimalClick}
          equals={equalsClick}
          percentage={percentageClick}
        />
      </div>

      <div id="note">This calculator uses Formula/expression logic</div>

      {/* Simple footer to give yourself credit */}
      <div id="author">
        Design and coded by <br />
        <a
          href="https://codepen.io/lace1010/pen/dyXXYJE"
          target="_blank"
          rel="noreferrer"
        >
          {/* React said if I don't have rel="noreferrer" it is a 
      security risk. So I just added it and the alert is gone.  #secure */}
          Hunter Lacefield
        </a>
      </div>
    </div>
  );
}

function Buttons(props) {
  return (
    <div id="buttons-container">
      {/* Set onClick equal to the prop that is needed passed in <Button (prop...) />  up in the main function */}
      <button id="clear" value="AC" style={clearStyle} onClick={props.allClear}>
        AC
      </button>

      <button
        id="clearOne"
        value="C"
        style={signDecimalChange}
        onClick={props.clearOne}
      >
        C
      </button>

      {/* Set onClick equal to the prop that is needed passed in <Button (prop...) />  up in the main function */}
      <button
        id="percentage"
        style={signDecimalChange}
        value="percent"
        onClick={props.percentage}
      >
        %
      </button>
      {/* Set onClick equal to the prop that is needed passed in <Button (prop...) />  up in the main function */}
      <button
        id="divide"
        style={operatorStyle}
        value="/"
        onClick={props.numberOperator}
      >
        /
      </button>
      {/* Set onClick equal to the prop that is needed passed in <Button (prop...) />  up in the main function */}
      <button id="seven" value="7" onClick={props.numberOperator}>
        7
      </button>
      <button id="eight" value="8" onClick={props.numberOperator}>
        8
      </button>
      <button id="nine" value="9" onClick={props.numberOperator}>
        9
      </button>
      <button
        id="multiply"
        style={operatorStyle}
        value="*"
        onClick={props.numberOperator}
      >
        x
      </button>
      <button id="four" value="4" onClick={props.numberOperator}>
        4
      </button>
      <button id="five" value="5" onClick={props.numberOperator}>
        5
      </button>
      <button id="six" value="6" onClick={props.numberOperator}>
        6
      </button>
      <button
        id="subtract"
        style={operatorStyle}
        value="-"
        onClick={props.numberOperator}
      >
        -
      </button>
      <button id="one" value="1" onClick={props.numberOperator}>
        1
      </button>
      <button id="two" value="2" onClick={props.numberOperator}>
        2
      </button>
      <button id="three" value="3" onClick={props.numberOperator}>
        3
      </button>
      <button
        id="add"
        style={operatorStyle}
        value="+"
        onClick={props.numberOperator}
      >
        +
      </button>
      <button
        id="zero"
        className="jumbo"
        value="0"
        onClick={props.numberOperator}
      >
        0
      </button>
      <button id="decimal" value="." onClick={props.decimal}>
        .
      </button>
      {/* Set onClick equal to the prop that is needed passed in <Button (prop...) />  up in the main function */}
      <button
        id="equals"
        style={operatorStyle}
        value="="
        onClick={props.equals}
      >
        =
      </button>
    </div>
  );
}

function Output(props) {
  return <div id="display">{props.answer}</div>;
}
function Formula(props) {
  return <div id="formula">{props.formula}</div>;
}
ReactDOM.render(<MyCalculator />, document.getElementById("root"));
