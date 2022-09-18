document
    .addEventListener('DOMContentLoaded', function () {
        document.getElementById('refrech-result').addEventListener('click', refrech, false)
        document.getElementById('phpagedownload').addEventListener('click', phpageDownload, false)
        document.getElementById('epagedownload').addEventListener('click', epageDownload, false)
        document.getElementById("ecopy").addEventListener('click',copy, false)
        document.getElementById("pcopy").addEventListener('click',copy, false)
        document.getElementById("sendMail").addEventListener('click',toEmail, false)
        document.getElementById('phone').addEventListener('click', phoneAct, false)
        document.getElementById('email').addEventListener('click', emailAct, false)
        document.getElementById('download-csv').addEventListener('click', downloadCsv, false)
        document.getElementById('download-txt').addEventListener('click', downloadTxt, false)
        refrech(false)
    }, false);