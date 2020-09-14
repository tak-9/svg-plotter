import React, {useState} from 'react';

function App() {
    const [textInput, setTextInput] = useState('');
    const [commands, setCommands] = useState([]);
    const [errorMsg, setErrorMsg] = useState('');

    /**
     * This validates user's input. Display error message by setErrorMsg() if any.
     * @param  {Object []} linesArr - Input from textarea, array which has been split by "\n".
     * @returns {boolean} true - Ok, false - error
     */
    const validateInput = (linesArr) => {
        let isInputOK = true;
        let errorLineNumbers = [];

        // Perform check for each line. 
        for (let i=0; i<linesArr.length; i++){
            const lineStr = linesArr[i];
            const lineNumber = i + 1;
            // 1. Skip checking if line is empty or only space characters.
            if (lineStr.trim() === ''){
                continue;
            }
            // 2. A line must much one of these regular expressions. (A|B|C) is (A or B or C)
            // (^[rR]\s+[0-9]+\s+[0-9]+\s+[0-9]+\s+[0-9]+$) is for Rectangular. 
            // (^[cC]\s+[0-9]+\s+[0-9]+\s+[0-9]+$) is for Circle.
            // (^[pP](\s+[0-9]+,[0-9]+){3,}$) is for Polygon. a{3,} means 3 or more of a must be specified.
            // (^[lL]\s+[0-9]+\s+[0-9]+\s+[0-9]+\s+[0-9]+$) is for Line.
            const regEx = 
                /(^[rR]\s+[0-9]+\s+[0-9]+\s+[0-9]+\s+[0-9]+$)|(^[cC]\s+[0-9]+\s+[0-9]+\s+[0-9]+$)|(^[pP](\s+[0-9]+,[0-9]+){3,}$)|(^[lL]\s+[0-9]+\s+[0-9]+\s+[0-9]+\s+[0-9]+$)/
            //console.log("validateInput", lineStr);
            if (!((lineStr.trim()).match(regEx))){ 
                // Found error in user's input
                isInputOK = false;
                errorLineNumbers.push(lineNumber);
            }
        }

        if (isInputOK){
            setErrorMsg('');
        } else { 
            let errorMessageStr = "Invalid input at line " + errorLineNumbers.join(',');
            setErrorMsg(errorMessageStr);
        }
        return isInputOK;
    }  
      
    /**
     * This is called when Draw button is clicked.
     */
    const buttonHandler = () => {
        // Clear previous error message if exists.
        setErrorMsg("");
        
        // Show error message and do nothing if textarea is empty.
        if (textInput.trim() === ''){
            // Exit from function if Error is found in text input. Skip draw().
            setErrorMsg("Input is empty.");
            return;
        }

        // Split and put them into array for each line.
        let linesArr = textInput.split("\n");
        if (!validateInput(linesArr)){
            // Exit from function if Error is found in text input. Skip draw().
            return;
        }

        // Add random color to the end of line
        let linesWithRandomColor = [];
        for (let i=0; i<linesArr.length; i++){
            linesWithRandomColor.push(linesArr[i] + " " + getRandomColor());
        }

        // By calling setCommands(), draw() is triggered to draw images.
        setCommands(linesWithRandomColor);
    }

    /**
     * Draw image for each line of text input
     * @param  {string} lineStr - String of each line from user's input. 
     */
    const draw = (lineStr) => { 
        // console.log("draw()", lineStr);
        // Use RegEx /\s+/ as there may be more than one space char between parameters. 
        // use trim to remove spaces 
        let args = lineStr.trim().split(/\s+/);
        switch (args[0]){
            case 'R':
            case 'r':
                return (
                    <rect x={args[1]} y={args[2]} width={args[3]} height={args[4]} fill={args[5]} />
                )
            case 'C':
            case 'c':
                return (
                    <circle cx={args[1]} cy={args[2]} r={args[3]} fill={args[4]} />
                )
            case 'P':
            case 'p':
                // Get the random color which has been added at the end of args
                let randomColor = args[args.length - 1];
                // Remove 'p' at begining from args. Remove color from last args. 
                // Then, assign it to 'pointsVal' as string
                // For example, 
                // p 200,10 250,190 160,210 #000000 -> 200,10 250,190 160,210
                args.shift();
                args.pop();
                let pointsStr = args.join();
                return (
                    <polygon points={pointsStr} fill={randomColor} />
                )
            case 'L':
            case 'l':
                return (
                    <line x1={args[1]} y1={args[2]} x2={args[3]} y2={args[4]} style={{stroke:args[5]}} />
                )
    
            default:
                // This shouldn't happen because it's already checked by regEx. 
                return(
                    <>Error!</>
                )
        }
    }

    /**
     * This generates random color in Hex code
     */
    const getRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    return (
        <div className="text-center">
            <h1>Simple SVG Plotter</h1>
            <div className="flex-container">
                <div className="flex-box">
                    Enter command and click Draw button.<br/>
                    <textarea
                        rows="4"
                        cols="50"
                        value={textInput}
                        onChange={e => setTextInput(e.target.value)}
                        placeholder="Enter command here..."
                    />
                    <br/>
                    <div className="usage">
                        Rectangle: <br/>
                        R &lt;X Coordinate&gt; &lt;Y Coordinate&gt; &lt;Width&gt; &lt;Height&gt;<br/>
                        Circle: <br/>
                        C &lt;CX Coordinate&gt; &lt;CY Coordinate&gt; &lt;Width&gt;<br/>
                        Polygon: <br/>
                        P &lt;X1,Y1&gt; &lt;X2,Y2&gt; &lt;X3,Y3&gt; ..... &lt;Xn,Yn&gt;<br/>
                        Line: <br/>
                        L &lt;X1 Coordinate&gt; &lt;Y1 Coordinate&gt; &lt;X2 Coordinate&gt; &lt;Y2 Coordinate&gt;<br/>
                    </div>
                    <button onClick={buttonHandler}>
                        Draw
                    </button>
                    <div className="error-message">
                        {errorMsg}
                    </div>
                </div>

                <div className="flex-box">
                    <div className="box">
                        SVG Image is displayed here.<br/>
                        <svg width="250" height="250">
                            {commands.map(draw)}
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
