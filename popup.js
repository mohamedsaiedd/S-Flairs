// localStorage.setItem("label", 'label');
// document.getElementById('header').innerHTML = localStorage.getItem('label') 
// document.getElementById('exampleFormControlTextarea1').innerHTML = localStorage.getItem('description')



// // const currentIssueKey = window.location.pathname.split('/').pop();
// let ticketUrl = `https://mohamedsaiedfathallah.atlassian.net/rest/api/3/issue/DEMO-1` 
// console.log(ticketUrl);


// fetch(ticketUrl, {
//     mode: 'no-cors',
//     headers: {Authorization: 'Bearer {ATATT3xFfGF0z8k_HbTWhnno43LJop6lJH0Ry-G6kmrO9LR7gPmtJBep4G5urrtPvZRp2vT_KSbJaYLw8mLxbDJPjoW3af419R_7t0Z05_Q2axCbpDccO1yZeUw-FdLR2ZorkQCTNThCZTOF4Sk3-1l5u9Y5KvovnB2in6_25kPk0GFv7U_hdgo=355EA0AC}',}
    
//   })
//      .then(data => {
//        console.log( data);
//     //    let description = json.fields
//       //  console.log(description);
//         //   localStorage.setItem("label", label);
//         //   chrome.storage.local.set({'label': label})
//         //   localStorage.setItem("description", description);
//         //   document.getElementById('header').innerHTML =  chrome.storage.local.get('pausedCount')
//         //   document.getElementById('exampleFormControlTextarea1').innerHTML = localStorage.getItem('description')
  
  
//       }
    //  )
     
    
    
    // elements
    let labelElement = document.getElementById('header')
    let taskIdElement = document.getElementById('taskId')
    let modifiedLabelElement = document.getElementById('modifiedHeader')
    let descriptionElement = document.getElementById('textArea')
    let modifiedDescriptionElement = document.getElementById('modifiedTextArea')

    //wrapers
    let descriptionWrap = document.querySelector('.textArea')
    let labelWrap = document.querySelector('.header')
    let modifiedLabelWrap = document.querySelector('.modifiedHeader')
    let modifiedDescriptionWrap = document.querySelector('.modifiedTextArea')
    

    // btns
    let refreshBtn = document.getElementById('refresh')
    let updateBtn = document.getElementById('Update')
    let rephraseBtn = document.getElementById('Rephrase')
    let taskElementValue = document.getElementById('taskElement')

    const placeholderElement = document.getElementById('placeholder');
    


    function getContent() { 
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            const currentTab = tabs[0];
            const pathname = new URL(currentTab.url).pathname;
            const currentIssueKey = pathname.split('/').pop();
          
            const prefs = {
                label : labelElement.value,
                taskId : taskIdElement.value,
                description : descriptionElement.value,
                modifiedLabel : modifiedLabelElement.value,
                modifiedDescription : modifiedDescriptionElement.value,
                taskElement :  taskElementValue.value
            }
            chrome.runtime.sendMessage({ message: 'getData', pathname: currentIssueKey , prefs , fullPath: currentTab.url });
        });
        
    }

    function updateContent() {
        
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            const currentTab = tabs[0];
            const pathname = new URL(currentTab.url).pathname;
            const currentIssueKey = pathname.split('/').pop();
            const prefs = {
                label : modifiedLabelElement.value,
                taskId : taskIdElement.value,
                description : modifiedDescriptionElement.value,
                modifiedLabel : modifiedLabelElement.value,
                modifiedDescription : modifiedDescriptionElement.value,
                taskElement :  taskElementValue.value
            }
            chrome.runtime.sendMessage({ message: 'updateData', pathname: currentIssueKey , prefs });
        });

        
    }


    function contentGetter() {
        chrome.storage.local.get(['label', 'description' , 'modifiedLabel'  , 'modifiedDescription' , 'taskId' , 'element' ], (result)=> {
            const { label , description , modifiedLabel , modifiedDescription ,taskId  ,element } = result;
            labelElement.value = label
            modifiedLabelElement.value = modifiedLabel
            descriptionElement.value = description
            modifiedDescriptionElement.value = modifiedDescription 
            taskIdElement.innerHTML = taskId
            taskElementValue.value =  element 
        })
    }

    function contentRephrase () {

        const prefs = {
            label : labelElement.value,
            description : descriptionElement.value,
            modifiedLabel : modifiedLabelElement.value,
            modifiedDescription : modifiedDescriptionElement.value,
            taskElement :  taskElementValue.value
        }
        chrome.runtime.sendMessage({ message: 'generateData' , prefs})
    }
    

    taskElementValue.onchange =()=> {
        const prefs = {
                label : labelElement.value,
                taskId : taskIdElement.value,
                description : descriptionElement.value,
                modifiedLabel : modifiedLabelElement.value,
                modifiedDescription : modifiedDescriptionElement.value,
                taskElement :  taskElementValue.value
        }
        chrome.runtime.sendMessage({ message: 'setTaskElement' , prefs})

        placeholderElement.style.display = 'flex';

        setTimeout(function () {
            
            // if (taskElementValue.value == 'label') {
            //     labelWrap.style.display = 'block'
            //     modifiedLabelWrap.style.display = 'block'
            //     descriptionWrap.style.display = 'none'
            //     modifiedDescriptionWrap.style.display = 'none'

            // }else if (taskElementValue.value == 'description'){
            //     labelWrap.style.display = 'none'
            //     modifiedLabelWrap.style.display = 'none'
            //     descriptionWrap.style.display = 'block'
            //     modifiedDescriptionWrap.style.display = 'block'
            // }
            placeholderElement.style.display = 'none';
        }, 20000);

    }

    refreshBtn.onclick =() => {
       

        placeholderElement.style.display = 'flex';

        setTimeout(function () {
            placeholderElement.style.display = 'none';
            getContent()
            contentGetter()
        }, 20000);
        
    }

    updateBtn.onclick =() => {
       

        placeholderElement.style.display = 'flex';

        updateContent()
        setTimeout(function () {
            placeholderElement.style.display = 'none';
            getContent()
        }, 10000);

        
    }
    
    rephraseBtn.onclick =() => {
        placeholderElement.style.display = 'flex';
        
        contentRephrase()

            setTimeout(function () {
                placeholderElement.style.display = 'none';
                contentGetter()
                getContent()
            }, 50000);
            
        }
        
  

    document.addEventListener('DOMContentLoaded', function () {


        
        chrome.runtime.onMessageExternal.addListener(function (message) {
            if (message === 'fetched') {
                console.log('fetched again');
                placeholderElement.style.display = 'none';
            }
        })

        contentGetter()
        getContent()
        
        setTimeout(function () {
            // Hide the preloader
            placeholderElement.style.display = 'none';
                contentGetter()
                getContent()
            }, 10000);
            
            
            
        })    

    





        // print the selected items