/**
 * Returns data from db.json as an array for use
 *
 * @returns {*} 
 */
function getCodes () {
  console.log('getCodes started')
  /** @type {string} */
  var url = `https://raw.githubusercontent.com/jdshupe/jdshupe.github.io/main/rental%20maker/src/db.json`;
  
	var info = 
	{
		"Data":
		{
			"repeatable": [],
			"oneTime": []  
		}
	};

  /** @type {*} */
  var request = new XMLHttpRequest();
  request.open('GET', url, true);

  request.onload = function() {
    if (request.status === 200) {
      var data = JSON.parse(request.responseText);
      for (var i = 0; i <data.Data.oneTime.length; i++) {
        info.Data.oneTime.push(data.Data.oneTime[i])
      }
      for (var i = 0; i <data.Data.repeatable.length; i++) {
        info.Data.repeatable.push(data.Data.repeatable[i])
      }
    }
  }
  request.send();
  console.log('getCodes finished')
  return info;
}



/**
 * Inserts a new Node (newNode) before another node (referenceNode)
 *
 * @param {Object} newNode - Node to be added
 * @param {Object} referenceNode - Node to be inserted before
 */
function insertAfter(newNode, referenceNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}



/**
 * Add a new line for rental information to the input form
 *
 * @param {string} chargeType - type of line to be added
 */
function addRentalRow(chargeType) {
  var adder;
  var type;
  var description;
  // updates the row index for which type of row is being added
  switch (chargeType) {
    case 'repeatable':
      added_rows_repeatable++;
      adder = added_rows_repeatable;
      type = 'rep';
      description = 'Repeatable';
      repeatable = true;
      break;
    case 'single':
      added_rows_one_time++;
      adder = added_rows_one_time;
      type = 'one-time';
      description = 'One Time';
      repeatable = false;
      break;
    default:
      break;
  }

  // create the new row to add
  var row = document.createElement('tr');
  Object.assign(row, {
    id:        `${type}-charge-row-${adder}`,
    className: `${type}`
  })

  // create the input to get the description
  var descriptionInput = document.createElement('input');
  Object.assign(descriptionInput, {
    id:        `${type}-charge-${adder}`,
    className: `${type} description`
  })
  descriptionInput.setAttribute('list',`${type}-charge-${adder}-options`); // assign the description list
  // datalist to hold the description values
  // this is populated with data at the end of this function
  var datalist = document.createElement('datalist');
  Object.assign(datalist, {
    id: `${type}-charge-${adder}-options`
  })

	var qty_entry = document.createElement('input');
	Object.assign(qty_entry, {
		id:			`${type}-charge-${adder}-qty`,
		className:	`${type} qty`,
		value:		`1`
	})

  // create the input to get the cost
  var price_entry = document.createElement('input');
  Object.assign(price_entry, {
    id:          `${type}-charge-${adder}-price`,
    className:   `${type} price`,
    placeholder: 'Price'
  })

  // create the input to get the cost code
  var costCodeInput = document.createElement('input');
  Object.assign(costCodeInput, {
    id:         `${type}-charge-${adder}-costCode`,
    className:  `${type} costCode`,
    value:      `400`
  })
  var costCodeDataList = document.createElement('datalist');
  Object.assign(costCodeDataList, {
    id: `${type}-charge-${adder}-costCodeOptions`
  })

  // create a button to delete the row
  var deleteButton = document.createElement('button');
  Object.assign(deleteButton, {
    id:        `${type}-charge-${adder}-delete`,
    className: `${type} delete`,
    type:      'button',
    innerHTML: 'X'
  })
  // assign functionality to the button
  deleteButton.setAttribute('onclick',`javascript: deleteRow('${row.id}');`);

  // cell 1 holds the description inputs and the datalist to go with it
  var cell1 = row.insertCell(0)
  cell1.appendChild(descriptionInput)
  cell1.appendChild(datalist)
	cell1.class="description-input";

	// cell 2 holds the qty input
	var cell2 = row.insertCell(1)
	cell2.appendChild(qty_entry)

  // cell 3 holds the cost of the line
  var cell3 = row.insertCell(2)
  cell3.appendChild(price_entry)
	cell3.class="price-input"

  // cell 4 holds the codeCode entry
  var cell4 = row.insertCell(3)
  cell4.appendChild(costCodeInput)
  cell4.appendChild(costCodeDataList)

  // cell 4 hold the delte button
  var cell5 = row.insertCell(4)
  cell5.appendChild(deleteButton)

  if (type == 'one-time' && adder == 1) {
		document.getElementById(`one-time-charges-table`).children[0].appendChild(row)
  } else {
    insertAfter(row, document.getElementById(`${type}-charge-row-${adder - 1}`))
  }
  populateDatalist(descriptionInput.id, repeatable)
}



/**
 * Pulls a list of charges on the input form
 *
 * @param {*} type - (rep/one_time) what type of line to pull
 * @return {object} contains the description code and price of each line
 */
function getLines (type) {
  var getLines = $(`tr.${type}`).map(function () {
    var description = $(this).find('.description').val()
    return {
      'description': description.split(' - ')[0],
      'value': description.split(' - ')[1],
	  'qty': $(this).find('.qty').val(),
      'price': $(this).find('.price').val(),
      'costCode': $(this).find('.costCode').val()
    }
  }).get()
  return getLines
}



/**
 * Takes all info from the input form and creates the upload table, tied to button on html
 *
 */
function createUpload () {
	$('#rental').toggle()
	document.getElementById('rental-body').innerHTML = '';

	var items = {'repeatable':getLines('rep'), 'oneTime':getLines('one-time')}
	var job_num = $('#job-num-input').val()
	var wbs_code = $('#wbs-code-input').val()
	var startDate = $('#start-date-input').val()
	var duration = $('#duration-input').val()
	var rentalLength = parseInt($('input[name="rental length"]:checked').val());
	var taxCode = $('#tax-code-input').val()

	items.repeatable.forEach(element => {
		addLineToUpload(element,job_num,startDate,0,rentalLength,taxCode, wbs_code, true)
	});
	items.oneTime.forEach(element => {
		addLineToUpload(element,job_num,startDate,0,rentalLength, taxCode, wbs_code)
	});
	if (duration > 1) {
		for (let month = 1; month < duration; month++) {
			items.repeatable.forEach(element => {
				addLineToUpload(element,job_num,startDate,month,rentalLength, taxCode, wbs_code,true)
			});
		}
	}
	console.log($('#rental')[0].hidden)
	if ($('#rental').is(":visible")) {
		displayJobsTable(tableToJson('rental'), "history-table")
	}
}



/**
 * Pads a number with leading zeros
 *
 * @param {number} num - the number to be padded
 * @param {number} size - the length of the number to be returned
 * @return {string} - the initial number with enough leading zeros to be the size provided
 */
function pad(num, size) {
  num = num.toString();
  while (num.length < size) num = "0" + num;
  return num;
}



/**
 * Called by the create upload function to add the individual lines
 *
 * @param {object} dataObject
 * @param {string} jobNumber
 * @param {Date} startDate
 * @param {number} monthTick
 * @param {number} rentalLength
 * @param {boolean} repeatable
 */
function addLineToUpload (dataObject, jobNumber, startDate, monthTick, rentalLength, taxCode, wbsCodeValue, repeatable) {
  var row = document.createElement('tr')
  var descriptionWithDuration

  if (repeatable) {
    var date1 = new Date(`${startDate} 00:00`);
    var year = date1.getFullYear();
    var month = date1.getMonth();
    var day = date1.getDate();
    date1.setDate(day + (monthTick * rentalLength))
    var date2 = new Date(year,month,day + ((monthTick + 1) * rentalLength));
    descriptionWithDuration = `
      ${dataObject.description} -
      ${date1.getFullYear()}/${pad(date1.getMonth() + 1,2)}/${pad(date1.getDate(),2)} -
      ${date2.getFullYear()}/${pad(date2.getMonth() + 1,2)}/${pad(date2.getDate(),2)}`
  } else descriptionWithDuration = dataObject.description

  var holder = row.insertCell(0)
  holder.innerHTML = `&nbsp`
  var addedLineType = row.insertCell(1)
  addedLineType.innerHTML = 'C'
  var plantItem = row.insertCell(2)
  plantItem.innerHTML = 'N'
  var job = row.insertCell(3)
  job.innerHTML = jobNumber
  var code = row.insertCell(4)
  code.innerHTML = dataObject.value
  var description = row.insertCell(5)
  description.innerHTML = descriptionWithDuration
  var wbsCode = row.insertCell(6)
  wbsCode.innerHTML = wbsCodeValue
  var quantity = row.insertCell(7)
  quantity.innerHTML = dataObject.qty
  var un = row.insertCell(8)
  un.innerHTML = 'EA'
  var price = row.insertCell(9)
  price.innerHTML = dataObject.price
  var per = row.insertCell(10)
  per.innerHTML = 'EA'
  row.insertCell(11).innerHTML = ``
  row.insertCell(12).innerHTML = ``
  var taxCodeCell = row.insertCell(13)
  taxCodeCell.innerHTML = taxCode
  row.insertCell(14).innerHTML = ``
  row.insertCell(15).innerHTML = ``
  var pol_chgovd = row.insertCell(16)
  pol_chgovd.innerHTML = 'no'
  var tx = row.insertCell(17)
  tx.innerHTML = 'no'
  var pol_taxovr = row.insertCell(18)
  pol_taxovr.innerHTML = 'yes'
  for (i = 19; i <= 32; i++) {
    row.insertCell(i).innerHTML = ``
  }
  var dueDate = row.insertCell(33)
  dueDate.innerHTML = new Date().toLocaleDateString()
  row.insertCell(34).innerHTML = ``
  row.insertCell(35).innerHTML = `0`
  row.insertCell(36).innerHTML = `0`
  var costType = row.insertCell(37)
  costType.innerHTML = `${dataObject.costCode}E`
  var costCategory = row.insertCell(38)
  costCategory.innerHTML = 'E'
  var polFactor = row.insertCell(39)
  polFactor.innerHTML = 1
  row.insertCell(40).innerHTML = ``
  row.insertCell(41).innerHTML = ``

  document.getElementById('rental-body').appendChild(row)
}



/**
 * removes an element by its id and updates row count
 *
 * @param {string} id
 */
function deleteRow(id) {
  var row = document.getElementById(id)
  row.remove()
  id.includes("one-time") ? added_rows_one_time-- : added_rows_repeatable--
}



function selectElementContents(el) {
  var body = document.body, range, sel;
  if (document.createRange && window.getSelection) {
    range = document.createRange();
    sel = window.getSelection();
    sel.removeAllRanges();
    try {
      range.selectNodeContents(el);
      sel.addRange(range);
    } catch (e) {
      range.selectNode(el);
      sel.addRange(range);
    }
  } else if (body.createTextRange) {
    range = body.createTextRange();
    range.moveToElementText(el);
    range.select();
    document.execCommand("copy");
  }
  document.execCommand("copy");
}

function populateDatalist(inputId, repeatable) {
  console.log('populateDatalist started')
  var datalist = document.getElementById(inputId).nextElementSibling;
	if (datalist.childElementCount > 0) {
		console.log('Already Populated');
		return 0;
	}
  var arrayOfCharges = repeatable ? mainData.Data.repeatable : mainData.Data.oneTime;
  for (let i = 0; i < arrayOfCharges.length; i++) {
    var option = document.createElement('option');
    option.value = arrayOfCharges[i].Description + ' - ' + arrayOfCharges[i].tsv_code
    datalist.appendChild(option)
  }
  console.log('populateDatalist finished')
}


var added_rows_repeatable = 1;
var added_rows_one_time = 1;


function tableToJson(tableId) {
	var table = document.getElementById(tableId);
	var data = [];

	// first row needs to be headers
	var headers = [];

	for (var i=0; i<table.rows[0].cells.length; i++) {
		headers[i] = table.rows[0].cells[i].innerHTML.replace(/[\n\t]/g, '');
	}

	 // go through cells
	for (var i=1; i<2; i++) {

		var tableRow = table.rows[i];
		var rowData = {};

		for (var j=0; j<tableRow.cells.length; j++) {
			rowData[headers[j]] = tableRow.cells[j].innerHTML.replace(/[\n\t]/g, '');
		}
			data.push(rowData);
		}       

	// return the data as a JSON string
	return JSON.stringify(data);
}

function displayJobsTable(stringifiedTables, tableId) {
	const table = document.getElementById(tableId);
	console.log(stringifiedTables);
	console.log(JSON.parse(stringifiedTables));

	let jobs = [];

	//Parse each stringified table into an array of job objects
	for (let i = 0; i < JSON.parse(stringifiedTables).length; i++) {
		jobs = JSON.parse(stringifiedTables);
	}
	console.log(jobs);

	if (!hasTableHeader(tableId)) {

		// Create table headers
		const headers = ['Job', 'Description', 'Start Date', 'Duration'];
		
		const headerRow = document.createElement('thead');
		for (let i = 0; i < headers.length; i++) {
			headerRow.appendChild(document.createElement('th')).
				appendChild(document.createTextNode(headers[i]));
		}
		table.appendChild(headerRow);
	}

	// Create table rows
	for (let i = 0; i < jobs.length; i++) {
		const job = jobs[i];
		const row = table.insertRow();
		const jobCell = row.insertCell();
		jobCell.textContent = job['Job'];
		const descCell = row.insertCell();
		descCell.textContent = job['Description'];
		const startDateCell = row.insertCell();
		startDateCell.textContent = job['Start Date'];
		const durationCell = row.insertCell();
		durationCell.textContent = job['Duration'];
	}
}

function hasTableHeader(tableElementName) {
	tableElement = document.getElementById(tableElementName);
	if (tableElement.children[0] && tableElement.children[0].nodeName === 'THEAD') {
		return true;
	}
	return false;
}
