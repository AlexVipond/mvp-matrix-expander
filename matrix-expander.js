/* Matrix Expander */
let uploadCSV = document.querySelector("#upload-csv"),
    uploadButton = document.querySelector("#upload-button");
    directed = document.querySelector("#directed"),
    undirected = document.querySelector("#undirected"),
    parseCSV = document.querySelector("#parse-csv");

uploadCSV.addEventListener("change", function() {
    uploadButton.style["background-color"] = "var(--theme)";
    uploadButton.style.color = "var(--light)";
    uploadButton.innerHTML = uploadCSV.value.split("\\").reverse()[0];
});

parseCSV.addEventListener("click", function(event) {
    if(!uploadCSV.value) {
        alert("Don't forget to upload a file!");
    } else if(directed.checked === false && undirected.checked === false) {
        alert("Don't forget to choose directed or undirected!");
    } else {
        event.preventDefault();

        let matrix, rows, columns, firstColumn, connections = [], elements;

        Papa.parse(uploadCSV.files[0], {
            header: true,
            complete: function(matrix) {
                parseCSV.style["background-color"] = "#d93e4a";
                parseCSV.style.color = "var(--light)";
                parseCSV.innerHTML = "You have taken the red pill.";

                uploadCSV.disabled = true;
                directed.disabled = true;
                undirected.disabled = true;
                parseCSV.disabled = true;

                rows = matrix.data;
                columns = matrix.meta.fields.slice(1);

                if(undirected.checked) {
                    rows.forEach(row => {
                        columns.forEach(column => {
                            if(row[Object.keys(row)[0]] !== column && row[column] > 0) {
                                connections.push({
                                    "from": row[Object.keys(row)[0]],
                                    "to": column,
                                    "strength": Number(row[column])
                                });
                            }
                        });

                        columns.shift();
                    });

                    elements = rows.map((row, i) => {
                        row = {"label": rows[i][Object.keys(rows[i])[0]]}
                        return row;
                    });
                } else if(directed.checked) {
                    rows.forEach(row => {
                        columns.forEach(column => {
                            if(row[Object.keys(row)[0]] !== column && row[column] > 0) {
                                connections.push({
                                    "from": row[Object.keys(row)[0]],
                                    "to": column,
                                    "strength": Number(row[column])
                                });
                            }
                        });
                    });

                    elements = rows.map((row, i) => {
                        row = {"label": rows[i][Object.keys(rows[i])[0]]}
                        return row;
                    });
                }

                document.querySelector("#results-wrapper").classList.add("show-results");

                document.querySelector("#results").innerHTML = JSON.stringify(JSON.parse("{\"elements\":" + JSON.stringify(elements) + ",\"connections\":" + JSON.stringify(connections) + "}"), null, 2);

                // let copyText = document.querySelector("#copy-text");
                // copyText.value = document.querySelector("#results").innerHTML;
                // // copyText.focus();
                // copyText.select();
                // document.execCommand('selectall');
                // document.execCommand('Copy');
            }
        });
    }
});
