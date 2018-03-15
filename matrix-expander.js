/* Matrix Expander */
let uploadCSV = document.querySelector("#upload-csv"),
    uploadButton = document.querySelector("#upload-button");
    directed = document.querySelector("#directed"),
    undirected = document.querySelector("#undirected"),
    parseCSV = document.querySelector("#parse-csv"),
    downloadButton = document.querySelector("#download-json");

let resultString, downloadData;

uploadCSV.addEventListener("change", function() {
    uploadButton.style["background-color"] = "#1ec503";
    uploadButton.style.color = "#fcfcfa";
    uploadButton.innerHTML = uploadCSV.value.split("\\").reverse()[0];
});

parseCSV.addEventListener("click", function(event) {
    if(!uploadCSV.value) {
        alert("Don't forget to upload a file!");
    } else if(uploadButton.innerHTML.split(".")[1] !== "csv") {
        alert("Oops - that's not a .csv!");
    } else if(directed.checked === false && undirected.checked === false) {
        alert("Don't forget to choose directed or undirected!");
    } else {
        event.preventDefault();

        let matrix, rows, columns, firstColumn, connections = [], elements;

        let file = uploadCSV.files[0];

        Papa.parse(file, {
            header: true,
            complete: function(matrix) {
                parseCSV.style["background-color"] = "#d93e4a";
                parseCSV.style.color = "#fcfcfa";
                parseCSV.innerHTML = "You have taken the red pill.";

                uploadCSV.disabled = true;
                directed.disabled = true;
                undirected.disabled = true;
                parseCSV.disabled = true;

                console.log(matrix);
                rows = matrix.data;
                columns = matrix.meta.fields.slice(1);
                console.log(columns);

                if(undirected.checked) {
                    rows.forEach(row => {
                        columns.forEach(column => {
                            if(row[Object.keys(row)[0]] !== column && row[column] > 0) {
                                connections.push({
                                    "from": row[matrix.meta.fields[0]],
                                    "to": column,
                                    "strength": Number(row[column])
                                });
                            }
                        });

                        columns = columns.slice(1);
                    });

                    elements = rows.map((row, i) => {
                        row = {"label": rows[i][matrix.meta.fields[0]]}
                        return row;
                    });
                } else if(directed.checked) {
                    rows.forEach(row => {
                        columns.forEach(column => {
                            if(row[matrix.meta.fields[0]] !== column && row[column] > 0) {
                                connections.push({
                                    "from": row[matrix.meta.fields[0]],
                                    "to": column,
                                    "strength": Number(row[column])
                                });
                            }
                        });
                    });

                    elements = rows.map((row, i) => {
                        row = {"label": rows[i][matrix.meta.fields[0]]}
                        return row;
                    });
                }

                resultString = JSON.stringify(JSON.parse("{\"elements\":" + JSON.stringify(elements) + ",\"connections\":" + JSON.stringify(connections) + "}"), null, 2);

                document.querySelector("#results-wrapper").classList.add("show-results");

                document.querySelector("#results").innerHTML = resultString;

                downloadData = "text/json;charset=utf-8," + encodeURIComponent(resultString);

                downloadButton.innerHTML += '<a class="button" href="data:' + downloadData + '" download="' + uploadButton.textContent.replace('.csv','') + '.json">Download JSON</a>';

                // console.table(rows);
                // console.table(elements);
                // console.table(connections);
            }
        });
    }
});
