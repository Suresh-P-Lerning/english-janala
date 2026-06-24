const loadLessons = () => {
    fetch('https://openapi.programming-hero.com/api/levels/all')
        .then(respnse => respnse.json())
        .then(json => displayLessons(json.data))
}
const removeActive = () => {
    const removeActiveBtn = document.querySelectorAll('.lesson-btn')
    removeActiveBtn.forEach(removeActive => {
        removeActive.classList.remove('active')
    })
}

// Spin Loading Section

const loaderLoad=(spin)=>{
    if(spin===true){
        document.getElementById('loading-loader').classList.remove('hidden')
        document.getElementById('word-display-container').classList.add('hidden')
    }else{
        document.getElementById('loading-loader').classList.add('hidden')
        document.getElementById('word-display-container').classList.remove('hidden')        
    }
 }

const loadLevelWord = (id) => {
    loaderLoad(true)
    const url = `https://openapi.programming-hero.com/api/level/${id}`
    fetch(url)
        .then(response => response.json())
        .then(data => {
            removeActive()
            // const removeActive = document.querySelectorAll('.lesson-btn')
            // removeActive.forEach(applyRemove=>{
            //     applyRemove.classList.remove('active')
            // })
            const activeStyle = document.getElementById(`lessonId-btn-${id}`)
            activeStyle.classList.add('active')
            displayLavelWord(data.data)
        })
}



// Async fetch function
const loadWordDeatils = async (id) => {
    const url = `https://openapi.programming-hero.com/api/word/${id}`
    const res = await fetch(url)
    const details = await res.json()
    wordDetails(details.data)

}

// Load Synonyms Function 
const loadSynonyms =(synonyms)=>{
    const synonymsContainer = synonyms.map(synonym=>`<span class='btn mx-2'>${synonym}</span>`)
    return(synonymsContainer.join(" "))
}

// Pronounce Word 
function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-EN"; // English
  window.speechSynthesis.speak(utterance);
}



const wordDetails = (detail) => {
    console.log(detail)
    const detailsContainer = document.getElementById('details-container');
    detailsContainer.innerHTML = `
        <div class="">
            <h1 class="text-2xl font-bold">${detail.word} (<i class="fa-solid fa-microphone-lines"></i>: <span class="bangla-font">${detail.pronunciation}</span>)</h1>
        </div>
        <div class="">
            <h1 class="text-xl font-bold">Meaning</h1>
            <h1 class="text-xl font-semibold">${detail.meaning}</h1>
        </div>
        <div class="">
            <h1 class="text-xl font-bold">Example</h1>
            <p>${detail.sentence}</p>
        </div>
        <div class="">
            <h1 class="text-xl font-bold">সমার্থক শব্দ গুলো</h1>
            ${loadSynonyms(detail.synonyms)}
        </div>    
    ` 
    document.getElementById('word_modal').showModal(); 
}
const displayLavelWord = (words) => {    
    const wordDisplayContainer = document.getElementById('word-display-container');
    wordDisplayContainer.innerHTML = "";
    if (words.length === 0) {
        wordDisplayContainer.innerHTML = `
            <div class="col-span-full text-center space-y-3 bangla-font">
                <img class="mx-auto" src="./assets/alert-error.png" alt="">
                <p class="text-gray-500">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
                <h1 class="text-3xl font-bold">নেক্সট Lesson এ যান</h1>
           </div> 
        `
        loaderLoad(false)
        return
    }
    words.forEach(word => {
        const wordDisplayDiv = document.createElement('div')

        wordDisplayDiv.innerHTML = `
          <div class="bg-white rounded-xl py-10 px-5 text-center space-y-3">
             <h1 class="text-2xl font-bold">${word.word ? word.word : "ওয়ার্ড পাওয়া যানি"}</h1>
             <p class="font-semibold">Meaning /Pronounciation</p>
             <p class="text-xl font-semibold bangla-font">${word.meaning ? word.meaning : "অর্থ পাওয়া যায়নি"}/${word.pronunciation ? word.pronunciation : "pronunciation পাওয়া যায়নি"}</p>

                <div class="flex justify-between">
                    <button onclick="loadWordDeatils(${word.id})" class="bg-[#1A91FF10] px-3 py-2"><i class="fa-solid fa-circle-info"></i></button>
                    <button onclick="pronounceWord('${word.word}')" class="bg-[#52535510] px-3 py-2"><i class="fa-solid fa-volume-high"></i></button>
                </div>
        `
        wordDisplayContainer.appendChild(wordDisplayDiv)
    })
    loaderLoad(false)
}

const displayLessons = (lessons) => {
    const levelContainer = document.getElementById('level-container')
    // levelContainer='';
    for (let lesson of lessons) {
        const btnDiv = document.createElement('div')
        btnDiv.innerHTML = `
     <button id="lessonId-btn-${lesson.level_no}" onclick="loadLevelWord(${lesson.level_no})"  class="btn btn-outline btn-primary lesson-btn"><i class="fa-solid fa-book-open"></i> Lesson- ${lesson.level_no} </button>
     `
        levelContainer.appendChild(btnDiv)
    }
}
loadLessons()

document.getElementById('search-btn').addEventListener("click", ()=>{
    removeActive()
    const inputValue = document.getElementById('search-input-value')
    const searchInputValue = inputValue.value.trim().toLowerCase()
    
    // All word link
    const url = "https://openapi.programming-hero.com/api/words/all"; 
    fetch(url)
    .then(res=>res.json())
    .then(data=>{
        const allwords = data.data
        const filterwords = allwords.filter(word=>word.word.toLowerCase().includes(searchInputValue))
        
        displayLavelWord(filterwords)
    })
})
