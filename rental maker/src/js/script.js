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
      type = 'one_time';
      description = 'One Time';
      repeatable = false;
      break;
    default:
      break;
  }

  // create the new row to add
  var row = document.createElement('tr');
  Object.assign(row, {
    id:        `${type}_charge_row_${adder}`,
    className: `${type}`
  })

  // create the input to get the description
  var descriptionInput = document.createElement('input');
  Object.assign(descriptionInput, {
    id:        `${type}_charge_${adder}`,
    className: `${type} description`,
    name:      `${description} Charge ${adder}`
  })
  descriptionInput.setAttribute('list',`${type}_charge_${adder}_options`); // assign the description list
  // datalist to hold the description values
  // this is populated with data at the end of this function
  var datalist = document.createElement('datalist');
  Object.assign(datalist, {
    id: `${type}_charge_${adder}_options`
  })

  // create the input to get the cost
  var price_entry = document.createElement('input');
  Object.assign(price_entry, {
    id:          `${type}_charge_${adder}_price`,
    className:   `${type} price`,
    placeholder: 'Price'
  })

  // create the input to get the cost code
  var costCodeInput = document.createElement('input');
  Object.assign(costCodeInput, {
    id:         `${type}_charge_${adder}_costCode`,
    className:  `${type} costCode`,
    value:      `400`
  })
  var costCodeDataList = document.createElement('datalist');
  Object.assign(costCodeDataList, {
    id: `${type}_charge_${adder}_costCodeOptions`
  })

  // create a button to delete the row
  var deleteButton = document.createElement('button');
  Object.assign(deleteButton, {
    id:        `${type}_charge_${adder}_delete`,
    className: `${type} delete`,
    type:      'button',
    innerHTML: 'X'
  })
  // assign functionality to the button
  deleteButton.setAttribute('onclick',`javascript: deleteRow('${row.id}');`);


  // populate the cells of the row with the form objects created above
  // cell 0 is blank to align with titles
  row.insertCell(0)

  // cell 1 holds the description inputs and the datalist to go with it
  var cell1 = row.insertCell(1)
  cell1.appendChild(descriptionInput)
  cell1.appendChild(datalist)

  // cell 2 holds the cost of the line
  var cell2 = row.insertCell(2)
  cell2.appendChild(price_entry)

  // cell 3 holds the codeCode entry
  var cell3 = row.insertCell(3)
  cell3.appendChild(costCodeInput)
  cell3.appendChild(costCodeDataList)

  // cell 4 hold the delte button
  var cell4 = row.insertCell(4)
  cell4.appendChild(deleteButton)

  if (type == 'one_time' && adder == 1) {
    insertAfter(row, document.getElementById(`rep_charge_row_${added_rows_repeatable}`))
    document.getElementById(`${type}_charge_row_${adder}`).children[0].innerHTML = "One Time Charges"
  } else {
    insertAfter(row, document.getElementById(`${type}_charge_row_${adder - 1}`))
  }
  populateDatalist(descriptionInput, repeatable)
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

  var items = {'repeatable':getLines('rep'), 'oneTime':getLines('one_time')}
  var job_num = $('#job_num').val()
  var wbs_code = $('#wbs_code').val()
  var startDate = $('#start_date').val()
  var duration = $('#duration').val()
  var rentalLength = parseInt($('input[name="rental length"]:checked').val());
  var taxCode = $('#tax_code').val()

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
  holder.innerHTML = `&nbsp;`
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
  quantity.innerHTML = 1
  var un = row.insertCell(8)
  un.innerHTML = 'EA'
  var price = row.insertCell(9)
  price.innerHTML = dataObject.price
  var per = row.insertCell(10)
  per.innerHTML = 'EA'
  row.insertCell(11).innerHTML = `&nbsp;`
  row.insertCell(12).innerHTML = `&nbsp;`
  var taxCodeCell = row.insertCell(13)
  taxCodeCell.innerHTML = taxCode
  row.insertCell(14).innerHTML = `&nbsp;`
  row.insertCell(15).innerHTML = `&nbsp;`
  var pol_chgovd = row.insertCell(16)
  pol_chgovd.innerHTML = 'no'
  var tx = row.insertCell(17)
  tx.innerHTML = 'no'
  var pol_taxovr = row.insertCell(18)
  pol_taxovr.innerHTML = 'yes'
  for (i = 19; i <= 32; i++) {
    row.insertCell(i).innerHTML = `&nbsp`
  }
  var dueDate = row.insertCell(33)
  dueDate.innerHTML = new Date().toLocaleDateString()
  row.insertCell(34).innerHTML = `&nbsp;`
  row.insertCell(35).innerHTML = `&nbsp;`
  row.insertCell(36).innerHTML = `&nbsp;`
  var costType = row.insertCell(37)
  costType.innerHTML = `${dataObject.costCode}E`
  var costCategory = row.insertCell(38)
  costCategory.innerHTML = 'E'
  var polFactor = row.insertCell(39)
  polFactor.innerHTML = 1
  row.insertCell(40).innerHTML = `&nbsp;`
  row.insertCell(41).innerHTML = `&nbsp;`
  row.insertCell(42).innerHTML = `&nbsp;`
  row.insertCell(43).innerHTML = `&nbsp;`

  document.getElementById('rental-body').appendChild(row)
}



function deleteRow(id) {
  var row = document.getElementById(id)
  row.remove()
  id.includes("one_time") ? added_rows_one_time-- : added_rows_repeatable--
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

function populateDatalist(input, repeatable) {
  console.log('populateDatalist started')
  var datalist = input.nextElementSibling;
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
