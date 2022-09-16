localStorage.setItem("emails","");
chrome
    .tabs
    .onUpdated
    .addListener(function (tabId, changeInfo, tab) {
        if (changeInfo.status == 'complete' && tab.active) {
            refrech(true);
        }
    })