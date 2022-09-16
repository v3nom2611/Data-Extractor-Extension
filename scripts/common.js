let emails = [];
let eDomains = [];
let earr = [];
let parr = [];
let phones = [];
let f1 = 0,
    f2 = 0,s;
let store,items;

Array.prototype.first = function() {
    //returns the first element 
    return this[0];
}

let empty = value => {
    // checks whether the value is empty or not 
    return value === undefined || value === null || value === '' || ['Null', 'NULL', '', 'null'].indexOf(value) > -1 ?
        true :
        false;
}

let emptyArray = array => {
    // checks whether the array is empty or not 
    return array !== undefined || array instanceof Array || array.length > 0 ?
        true :
        false;
}

const copyToClipboard = str => {
    //used to copy the element in clipboard
    const el = document.createElement('textarea');
    el.value = str;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document
        .body
        .appendChild(el);
    //checks whether the textarea is empty or not and if not then copy to clipboard from fisrt element to last 
    const selected = document
        .getSelection()
        .rangeCount > 0 ?
        document
        .getSelection()
        .getRangeAt(0) :
        false;
    el.select();
    document.execCommand('copy'); //used to copy the text from textarea to clipboard
    alert('Copied to clipboard');
    document
        .body
        .removeChild(el);
};


let str = '';

function csv() {
    str = "";
    if (emails.length > 0) {
        for (let obj of emails) {
            earr.push([obj]);
        }
        str += "Emails: ";
        str += "\n";
        str += "\n";
        earr.forEach(function(row) {
            str += row.join(',');
            str += "\n";
        });
    }
    if (phones.length > 0) {
        for (let obj of phones) {
            parr.push([obj]);
        }
        str += "\n";
        str += "Phone-Numbers: ";
        str += "\n";
        str += "\n";
        parr.forEach(function(row) {
            str += row.join(',');
            str += "\n";
        });
    }
    //merge the data with CSV
    download(str, "Data.csv");
}

function txt() {
    str = "";
    if (emails.length > 0) {
        str += "<-------- Emails -------->";
        str += "\n";
        str += "\n";
        str += emails.join('\n')
        str += "\n";
    }
    if (phones.length > 0) {
        str += "\n";
        str += "<-------- Phone-Numbers --------> ";
        str += "\n";
        str += "\n";
        str += phones.join('\n')
    }
    //merge the data with CSV
    download(str, "Data.txt");
}

function download(str, filename) {
    var hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(str);
    hiddenElement.target = '_blank';

    //provide the name for the CSV file to be downloaded
    hiddenElement.download = filename;
    hiddenElement.click();
}

function findEmails(text) {
    //to find emails on page 
    return text.toLowerCase().match(/(?!\S*\.(?:jpg|png|gif|bmp)(?:[\s\n\r]|$))[A-Z0-9._%+-]+@[A-Z0-9.-]{3,65}\.[A-Z]{2,4}/gi);
}

function phone(text) {
    const regex = /\+\d{1,4}\s?\(?\d{1,2}\)?(?:\s?\-?\d{1,3}){3,5}/gi;
    // const regex = /^(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
    return text.match(regex);
}

function EmailDomain(arr) {
    // pushing different domains inside an array and identifying them
    for (let obj of arr) {
        let index = obj.lastIndexOf('@');
        eDomains.push(obj.substr(index + 1, obj.length));
    }
    return eDomains;
}

const refrech = (onlyBadge = false) => {
    chrome
        .tabs
        .query({
            currentWindow: true,
            active: true
        }, function(tabs) {

            chrome
                .tabs
                .sendMessage(tabs[0].id, {
                    tab: tabs[0],
                    data: {
                        onlyBadge: onlyBadge
                    }
                }, showResults);
        });
}
let dummy = [];
const showResults = res => {
    if (res && res.content) {
        //gives the page and its html content
        dummy = [...new Set(findEmails(res.content))]
        for (let obj of dummy) {
            if (!(obj.includes(".jpg")) && !(obj.includes(".png")) && !(obj.includes(".gif")) && !(obj.includes(".bmp"))) {
                emails.push(obj);
            }
        }
        emails = [...new Set(emails)]
        // // s=emails.join(", ");
        // // console.log(JSON.stringify(emails));
        // // console.log(JSON.parse(emails));
        // // console.log(s);
        // // s=emails.join(", ");
        // items=localStorage.getItem('emails');
        // if(items==null){
        //     store=[];
        // }
        // else{
        //     store=items;
        // }
        // let temp=Object.assign(store,emails);
        // console.log(temp);
        // localStorage.setItem('emails',temp);
        phones = [...new Set(phone(res.content))]
        updateBadge(emails.length + phones.length);
        if (res.options && res.options.data && res.options.data.onlyBadge === true) {
            return false;
        }
        eDomains = [...new Set(EmailDomain(emails))];
        //making an array of all the emails on page 
        updateResultInfoView(emails.length + phones.length, eDomains.length);
        let results = document.getElementById('result');
        let ecopy = document.getElementById('ecopy');
        let pcopy = document.getElementById('pcopy');
        let sendMail = document.getElementById('sendMail');
        sendMail.style.display = 'none';
        results.style.display = 'none';
        ecopy.style.display = 'none';
        pcopy.style.display = 'none';
        total.style.display = 'none';
        results.innerText = "";
        total.innerText = "";
    }
}

const updateResultInfoView = (emailsUniqueCount = 0, domainUniqueCount = 0) => {

    const emailsUniqueCountEl = document.getElementById('emailsUniqueCount');
    const emailsDomainUniqueCountEl = document.getElementById('emailsDomainsUniqueCount');
    emailsUniqueCountEl.textContent = emailsUniqueCount;
    emailsDomainUniqueCountEl.textContent = domainUniqueCount;
}
const updateBadge = text => {

    chrome
        .browserAction
        .setBadgeBackgroundColor({
            color: [17, 125, 208, 1]
        });
    chrome
        .browserAction
        .setBadgeText({
            text: text.toString()
        });
}

const copy = () => {

    chrome
        .tabs
        .query({
            currentWindow: true,
            active: true
        }, function(tabs) {
            chrome
                .tabs
                .sendMessage(tabs[0].id, {
                    tab: tabs[0],
                    data: {}
                }, (res) => {
                    if (res && res.content) {
                        if (f1 == 1) {
                            copyToClipboard(emails.join(' '));
                        } else {
                            copyToClipboard(phones.join(' '));
                        }
                    }
                })
        })
}
const toEmail = () => {
    chrome
        .tabs
        .query({
            currentWindow: true,
            active: true
        }, function(tabs) {
            chrome
                .tabs
                .sendMessage(tabs[0].id, {
                    tab: tabs[0],
                    data: {}
                }, (res) => {

                    if (res && res.content) {
                        const emailsText = emails.join(';');
                        if (!empty(emailsText)) {
                            var emailUrl = 'mailto: ' + escape(emailsText);
                            chrome
                                .tabs
                                .create({
                                    url: emailUrl
                                }, function(tab) {
                                    setTimeout(function() {
                                        chrome
                                            .tabs
                                            .remove(tab.id);
                                    }, 500);
                                });
                        }

                    }
                })
        })
}
const downloadCsv = () => {
    chrome
        .tabs
        .query({
            currentWindow: true,
            active: true
        }, function(tabs) {
            chrome
                .tabs
                .sendMessage(tabs[0].id, {
                    tab: tabs[0],
                    data: {}
                }, (res) => {
                    if (res && res.content) {
                        if (emails.length > 0 || phones.length > 0) {
                            csv();
                        } else if (emails.length == 0 && phones.length == 0) {
                            alert("Nothing to download!")
                        }
                    }
                })
        })
}
const downloadTxt = () => {
    chrome
        .tabs
        .query({
            currentWindow: true,
            active: true
        }, function(tabs) {
            chrome
                .tabs
                .sendMessage(tabs[0].id, {
                    tab: tabs[0],
                    data: {}
                }, (res) => {
                    if (res && res.content) {
                        if (emails.length > 0 || phones.length > 0) {
                            txt();
                        } else if (emails.length == 0 && phones.length == 0) {
                            alert("Nothing to download!")
                        }
                    }
                })
        })
}
const emailAct = () => {
    let ecopy = document.getElementById('ecopy');
    let pcopy = document.getElementById('pcopy');
    let results = document.getElementById('result');
    let total = document.getElementById('total');
    let sendMail = document.getElementById('sendMail');
    results.style.display = 'block';
    total.style.display = 'block';
    pcopy.style.display = 'none';
    let data = emails.join('\n');
    if (data.length == 0) {
        results.innerText = "No Data Available";
        total.innerText = "Results: " + 0;
    } else {
        results.innerText = data;
        total.innerText = "Results: " + emails.length;
        ecopy.style.display = 'inline-block';
        sendMail.style.display = 'inline-block';
        f1 = 1;
        f2 = 0;
    }
}
const phoneAct = () => {
    let ecopy = document.getElementById('ecopy');
    let pcopy = document.getElementById('pcopy');
    let results = document.getElementById('result');
    let total = document.getElementById('total');
    let sendMail = document.getElementById('sendMail');

    sendMail.style.display = 'none';
    ecopy.style.display = 'none';
    results.style.display = 'block';
    total.style.display = 'block';
    let data = phones.join('\n');
    if (data.length == 0) {
        results.innerText = "No Data Available";
        total.innerText = "Results: " + 0;
    } else {
        f1 = 0;
        f2 = 1;
        results.innerText = data;
        total.innerText = "Results: " + phones.length;
        pcopy.style.display = 'inline-block';
    }
}
